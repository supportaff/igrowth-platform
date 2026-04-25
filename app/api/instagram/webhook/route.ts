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

    // Meta always expects 200 fast — process async
    processWebhook(body).catch(e => console.error('[webhook] async error:', e))

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('[webhook] parse error:', err)
    return NextResponse.json({ status: 'ok' }) // always 200 to Meta
  }
}

async function processWebhook(body: Record<string, unknown>) {
  const entries = (body.entry as Array<Record<string, unknown>>) ?? []

  for (const entry of entries) {
    const igAccountId = String(entry.id)

    const { data: account } = await supabase
      .from('instagram_accounts')
      .select('user_id, access_token, ig_user_id')
      .eq('ig_user_id', igAccountId)
      .single()

    if (!account) {
      console.warn('[webhook] No account found for ig_user_id:', igAccountId)
      continue
    }

    const { data: automations } = await supabase
      .from('automations')
      .select('*')
      .eq('user_id', account.user_id)
      .eq('status', 'active')

    if (!automations?.length) continue

    // ── DM messages ──
    const messagingEvents = (entry.messaging as Array<Record<string, unknown>>) ?? []
    for (const event of messagingEvents) {
      const sender     = event.sender as Record<string, string>
      const msgObj     = event.message as Record<string, unknown>
      const senderId   = sender?.id
      const msgText    = String(msgObj?.text ?? '')
      const mid        = String(msgObj?.mid ?? '')

      if (!senderId || !msgText) continue
      if (senderId === igAccountId) continue  // skip self

      // Dedup: skip if we already processed this message ID
      if (mid) {
        const { count } = await supabase
          .from('automation_logs')
          .select('id', { count: 'exact', head: true })
          .eq('sender_id', mid)
        if ((count ?? 0) > 0) continue
      }

      for (const auto of automations) {
        if (auto.trigger !== 'dm_keyword') continue
        const keywords: string[] = auto.keywords ?? []
        const matched = keywords.length === 0 ||
          keywords.some((kw: string) => msgText.toLowerCase().includes(kw.toLowerCase()))
        if (!matched) continue

        await executeActions(
          auto.actions, senderId, account.access_token,
          account.ig_user_id, account.user_id, supabase, auto.id,
          undefined, 'dm_keyword', msgText
        )
      }
    }

    // ── Post/Reel comments ──
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
          auto.actions, commenterId, account.access_token,
          account.ig_user_id, account.user_id, supabase, auto.id,
          commentId, expectedTrigger, commentText
        )
      }
    }
  }
}

// ── Execute actions + log each one ───────────────────────
async function executeActions(
  actions: Array<{ type: string; message: string; delay?: number }>,
  recipientId: string,
  accessToken: string,
  igAccountId: string,
  userId: string,
  db: SupabaseClient,
  automationId: string,
  commentId?: string,
  triggerType?: string,
  messageText?: string
) {
  for (const action of actions) {
    if ((action.delay ?? 0) > 0) {
      await new Promise(r => setTimeout(r, (action.delay ?? 0) * 60 * 1000))
    }

    let status       = 'success'
    let errorMessage = ''
    let igResponse: unknown = null

    try {
      if (action.type === 'send_dm') {
        igResponse = await sendDM(recipientId, action.message, accessToken, igAccountId)
      } else if (action.type === 'reply_comment' && commentId) {
        igResponse = await replyComment(commentId, action.message, accessToken)
      }
    } catch (err: unknown) {
      status       = 'failed'
      errorMessage = err instanceof Error ? err.message : String(err)
      console.error(`[webhook] Action ${action.type} failed:`, errorMessage)
    }

    // Log every action attempt
    await db.from('automation_logs').insert({
      automation_id:  automationId,
      user_id:        userId,
      trigger_type:   triggerType,
      sender_id:      recipientId,
      message_text:   messageText,
      action_type:    action.type,
      action_message: action.message,
      status,
      error_message:  errorMessage || null,
      ig_response:    igResponse ? JSON.stringify(igResponse) : null,
    })
  }

  // Increment run counter
  await db.rpc('increment_automation_runs', { automation_id: automationId })
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
