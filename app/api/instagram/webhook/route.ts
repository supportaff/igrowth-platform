import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN ?? 'igrowth_verify_2026'
const IG_API       = 'https://graph.instagram.com/v21.0'

// ── GET: Meta webhook verification handshake ─────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[webhook] Meta verification OK')
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// ── POST: Incoming Instagram events ──────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[webhook] event:', JSON.stringify(body))

    // Always return 200 immediately — process async so Meta doesn't timeout
    processWebhook(body).catch(e => console.error('[webhook] async error:', e))

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('[webhook] parse error:', err)
    return NextResponse.json({ status: 'ok' }) // always 200 to Meta
  }
}

// ── Safe JSON parse helper ───────────────────────────────
function safeParseJSON<T>(val: unknown, fallback: T): T {
  if (val === null || val === undefined) return fallback
  if (typeof val === 'object') return val as T
  if (typeof val === 'string') {
    try { return JSON.parse(val) as T } catch { return fallback }
  }
  return fallback
}

async function processWebhook(body: Record<string, unknown>) {
  const entries = (body.entry as Array<Record<string, unknown>>) ?? []

  for (const entry of entries) {
    const igAccountId = String(entry.id)
    console.log(`[webhook] processing entry for ig_account_id=${igAccountId}`)

    const { data: account, error: accErr } = await supabase
      .from('instagram_accounts')
      .select('user_id, access_token, ig_user_id')
      .eq('ig_user_id', igAccountId)
      .single()

    if (accErr || !account) {
      console.warn('[webhook] No account found for ig_user_id:', igAccountId, accErr?.message)
      const { data: allAccounts } = await supabase
        .from('instagram_accounts')
        .select('user_id, access_token, ig_user_id')
        .limit(1)

      if (!allAccounts?.length) {
        console.warn('[webhook] No instagram_accounts rows at all — user needs to reconnect Instagram')
        continue
      }
      console.log('[webhook] Using fallback account:', allAccounts[0].ig_user_id)
      Object.assign(entry, { _account: allAccounts[0] })
    }

    const resolvedAccount = (entry._account as typeof account) ?? account
    if (!resolvedAccount) continue

    const { data: rawAutomations } = await supabase
      .from('automations')
      .select('*')
      .eq('user_id', resolvedAccount.user_id)
      .eq('status', 'active')

    if (!rawAutomations?.length) {
      console.log(`[webhook] No active automations for user_id=${resolvedAccount.user_id}`)
      continue
    }

    const automations = rawAutomations.map(a => ({
      ...a,
      keywords:   safeParseJSON<string[]>(a.keywords, []),
      conditions: safeParseJSON<unknown[]>(a.conditions, []),
      actions:    safeParseJSON<Array<{ type: string; message: string; delay?: number }>>(a.actions, []),
    }))

    console.log(`[webhook] Found ${automations.length} active automation(s) for user_id=${resolvedAccount.user_id}`)

    // ── DM messages ──────────────────────────────────────
    const messagingEvents = (entry.messaging as Array<Record<string, unknown>>) ?? []
    for (const event of messagingEvents) {
      const sender   = event.sender as Record<string, string>
      const msgObj   = event.message as Record<string, unknown>
      const senderId = sender?.id
      const msgText  = String(msgObj?.text ?? '')
      const mid      = String(msgObj?.mid ?? '')

      if (!senderId || !msgText) continue
      if (senderId === igAccountId) continue

      console.log(`[webhook] DM from ${senderId}: "${msgText}" (mid=${mid})`)

      if (mid) {
        const { count } = await supabase
          .from('automation_logs')
          .select('id', { count: 'exact', head: true })
          .eq('message_id', mid)
        if ((count ?? 0) > 0) {
          console.log(`[webhook] Skipping duplicate mid=${mid}`)
          continue
        }
      }

      for (const auto of automations) {
        if (auto.trigger !== 'dm_keyword') continue
        const keywords: string[] = auto.keywords ?? []
        const matched = keywords.length === 0 ||
          keywords.some((kw: string) => msgText.toLowerCase().includes(kw.toLowerCase()))

        console.log(`[webhook] Automation "${auto.name}" keyword match: ${matched} (keywords: [${keywords.join(', ')}])`)
        if (!matched) continue

        await executeActions(
          auto.actions, senderId, resolvedAccount.access_token,
          resolvedAccount.ig_user_id, resolvedAccount.user_id,
          supabase, auto.id, mid, undefined, 'dm_keyword', msgText
        )
      }
    }

    // ── Post/Reel comments ───────────────────────────────
    const changes = (entry.changes as Array<Record<string, unknown>>) ?? []
    for (const change of changes) {
      const field = String(change.field ?? '')
      if (field !== 'comments' && field !== 'reel_comments') continue

      const val         = change.value as Record<string, unknown>
      const commentText = String(val?.text ?? '')
      const from        = val?.from as Record<string, string>
      const commenterId = from?.id
      const commentId   = String(val?.id ?? '')

      if (!commenterId || commenterId === igAccountId) continue

      const expectedTrigger = field === 'reel_comments' ? 'reel_comment' : 'post_comment'

      for (const auto of automations) {
        if (auto.trigger !== expectedTrigger) continue
        const keywords: string[] = auto.keywords ?? []
        const matched = keywords.length === 0 ||
          keywords.some((kw: string) => commentText.toLowerCase().includes(kw.toLowerCase()))
        if (!matched) continue

        await executeActions(
          auto.actions, commenterId, resolvedAccount.access_token,
          resolvedAccount.ig_user_id, resolvedAccount.user_id,
          supabase, auto.id, undefined, commentId, expectedTrigger, commentText
        )
      }
    }
  }
}

// ── Execute actions + log ────────────────────────────────
async function executeActions(
  actions: Array<{ type: string; message: string; delay?: number }>,
  recipientId: string,
  accessToken: string,
  igAccountId: string,
  userId: string,
  db: SupabaseClient,
  automationId: string,
  messageId?: string,
  commentId?: string,
  triggerType?: string,
  messageText?: string
) {
  if (!actions?.length) {
    console.warn(`[webhook] No actions to execute for automation ${automationId}`)
    return
  }

  for (const action of actions) {
    if ((action.delay ?? 0) > 0) {
      await new Promise(r => setTimeout(r, (action.delay ?? 0) * 60 * 1000))
    }

    let status       = 'success'
    let errorMessage = ''
    let igResponse: unknown = null

    try {
      if (action.type === 'send_dm') {
        console.log(`[webhook] Sending DM to ${recipientId}: "${action.message}"`)
        igResponse = await sendDM(recipientId, action.message, accessToken, igAccountId)
        console.log(`[webhook] DM sent successfully:`, igResponse)
      } else if (action.type === 'reply_comment' && commentId) {
        igResponse = await replyComment(commentId, action.message, accessToken)
      }
    } catch (err: unknown) {
      status       = 'failed'
      errorMessage = err instanceof Error ? err.message : String(err)
      console.error(`[webhook] Action ${action.type} failed:`, errorMessage)
    }

    await db.from('automation_logs').insert({
      automation_id:  automationId,
      user_id:        userId,
      trigger_type:   triggerType,
      sender_id:      recipientId,
      message_id:     messageId ?? null,
      message_text:   messageText,
      action_type:    action.type,
      action_message: action.message,
      status,
      error_message:  errorMessage || null,
      ig_response:    igResponse ? JSON.stringify(igResponse) : null,
    })
  }

  // FIX: wrap in Promise.resolve() so .catch() is available on PromiseLike
  await Promise.resolve(
    db.rpc('increment_automation_runs', { automation_id: automationId })
  )
    .then(() => console.log(`[webhook] Incremented run counter for ${automationId}`))
    .catch(e  => console.error('[webhook] increment_automation_runs failed:', e))
}

async function sendDM(
  recipientId: string,
  message: string,
  accessToken: string,
  igAccountId: string
) {
  const res = await fetch(`${IG_API}/${igAccountId}/messages`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient:    { id: recipientId },
      message:      { text: message },
      access_token: accessToken,
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(json))
  return json
}

async function replyComment(commentId: string, message: string, accessToken: string) {
  const res = await fetch(`${IG_API}/${commentId}/replies`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, access_token: accessToken }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(json))
  return json
}
