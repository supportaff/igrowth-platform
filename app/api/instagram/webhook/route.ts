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
    console.log('[webhook] RAW EVENT:', JSON.stringify(body))
    processWebhook(body).catch(e => console.error('[webhook] async error:', e))
    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('[webhook] parse error:', err)
    return NextResponse.json({ status: 'ok' })
  }
}

// ── Helpers ──────────────────────────────────────────
function safeParseJSON<T>(val: unknown, fallback: T): T {
  if (val === null || val === undefined) return fallback
  if (typeof val === 'object') return val as T
  if (typeof val === 'string') {
    try { return JSON.parse(val) as T } catch { return fallback }
  }
  return fallback
}

type Condition = { field: string; operator: string; value: string }

// Evaluate conditions array against a message text
function matchesConditions(conditions: Condition[], msgText: string): boolean {
  if (!conditions.length) return true // no conditions = match all
  return conditions.every(cond => {
    const text = msgText.toLowerCase()
    const val  = (cond.value ?? '').toLowerCase()
    switch (cond.operator) {
      case 'contains':     return text.includes(val)
      case 'not_contains': return !text.includes(val)
      case 'equals':       return text === val
      case 'starts_with':  return text.startsWith(val)
      case 'ends_with':    return text.endsWith(val)
      default:             return text.includes(val)
    }
  })
}

// Evaluate keywords array against a message text
function matchesKeywords(keywords: string[], msgText: string): boolean {
  if (!keywords.length) return true // empty keywords = match all
  return keywords.some(kw => msgText.toLowerCase().includes(kw.toLowerCase()))
}

async function processWebhook(body: Record<string, unknown>) {
  const entries = (body.entry as Array<Record<string, unknown>>) ?? []
  console.log(`[webhook] Processing ${entries.length} entr(ies)`)

  for (const entry of entries) {
    const igAccountId = String(entry.id)
    console.log(`[webhook] Entry ig_account_id=${igAccountId}`)

    // ─ Step 1: find the platform account ─────────────────
    let resolvedAccount: { user_id: string; access_token: string; ig_user_id: string } | null = null

    const { data: exactMatch, error: exactErr } = await supabase
      .from('instagram_accounts')
      .select('user_id, access_token, ig_user_id')
      .eq('ig_user_id', igAccountId)
      .single()

    if (exactMatch) {
      console.log(`[webhook] Exact account match: ig_user_id=${exactMatch.ig_user_id} user_id=${exactMatch.user_id}`)
      resolvedAccount = exactMatch
    } else {
      console.warn(`[webhook] No exact match for ig_user_id=${igAccountId} err=${exactErr?.message}`)
      // Fallback: use first account row (single-tenant)
      const { data: allAccounts } = await supabase
        .from('instagram_accounts')
        .select('user_id, access_token, ig_user_id')
        .limit(5)
      console.log(`[webhook] All instagram_accounts rows:`, JSON.stringify(allAccounts))
      if (allAccounts?.length) {
        resolvedAccount = allAccounts[0]
        console.log(`[webhook] Using fallback account: ig_user_id=${resolvedAccount.ig_user_id} user_id=${resolvedAccount.user_id}`)
      }
    }

    if (!resolvedAccount) {
      console.error('[webhook] FATAL: No instagram_accounts found. User must reconnect Instagram.')
      continue
    }

    // ─ Step 2: fetch active automations ─────────────────
    console.log(`[webhook] Querying automations for user_id=${resolvedAccount.user_id}`)
    const { data: rawAutomations, error: autoErr } = await supabase
      .from('automations')
      .select('*')
      .eq('user_id', resolvedAccount.user_id)
      .eq('status', 'active')

    console.log(`[webhook] automations query result: count=${rawAutomations?.length ?? 0} err=${autoErr?.message ?? 'none'}`)

    if (!rawAutomations?.length) {
      // Log ALL automations regardless of user_id to help debug
      const { data: allAutos } = await supabase.from('automations').select('id,user_id,status,name').limit(10)
      console.warn(`[webhook] No active automations for user_id=${resolvedAccount.user_id}. All automations:`, JSON.stringify(allAutos))
      continue
    }

    const automations = rawAutomations.map(a => ({
      ...a,
      keywords:   safeParseJSON<string[]>(a.keywords, []),
      conditions: safeParseJSON<Condition[]>(a.conditions, []),
      actions:    safeParseJSON<Array<{ type: string; message: string; delay?: number }>>(a.actions, []),
    }))

    console.log(`[webhook] ${automations.length} active automation(s) loaded`)

    // ─ Step 3: handle DM messages ─────────────────────
    const messagingEvents = (entry.messaging as Array<Record<string, unknown>>) ?? []
    console.log(`[webhook] ${messagingEvents.length} messaging event(s)`)

    for (const event of messagingEvents) {
      const sender   = event.sender as Record<string, string>
      const msgObj   = event.message as Record<string, unknown>
      const senderId = sender?.id
      const msgText  = String(msgObj?.text ?? '')
      const mid      = String(msgObj?.mid ?? '')

      if (!senderId || !msgText) {
        console.log(`[webhook] Skipping event - no senderId or msgText`)
        continue
      }
      if (senderId === igAccountId) {
        console.log(`[webhook] Skipping self-message from ${senderId}`)
        continue
      }

      console.log(`[webhook] DM from ${senderId}: "${msgText}" mid=${mid}`)

      // Dedup by mid
      if (mid) {
        const { count } = await supabase
          .from('automation_logs')
          .select('id', { count: 'exact', head: true })
          .eq('message_id', mid)
        if ((count ?? 0) > 0) {
          console.log(`[webhook] Duplicate mid=${mid}, skipping`)
          continue
        }
      }

      for (const auto of automations) {
        if (auto.trigger !== 'dm_keyword') {
          console.log(`[webhook] Automation "${auto.name}" trigger=${auto.trigger} != dm_keyword, skip`)
          continue
        }

        // Match by keywords OR conditions (whichever is populated)
        const keywordMatch   = matchesKeywords(auto.keywords, msgText)
        const conditionMatch = matchesConditions(auto.conditions, msgText)
        // Use conditions if present, else keywords
        const matched = auto.conditions.length > 0 ? conditionMatch : keywordMatch

        console.log(`[webhook] Automation "${auto.name}" keywords=[${auto.keywords.join(',')}] conditions=${JSON.stringify(auto.conditions)} keywordMatch=${keywordMatch} conditionMatch=${conditionMatch} matched=${matched}`)

        if (!matched) continue

        console.log(`[webhook] MATCHED automation "${auto.name}" - executing ${auto.actions.length} action(s)`)
        await executeActions(
          auto.actions, senderId, resolvedAccount.access_token,
          resolvedAccount.ig_user_id, resolvedAccount.user_id,
          supabase, auto.id, mid, undefined, 'dm_keyword', msgText
        )
      }
    }

    // ─ Step 4: handle post/reel comments ──────────────
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
        const matched = auto.conditions.length > 0
          ? matchesConditions(auto.conditions, commentText)
          : matchesKeywords(auto.keywords, commentText)
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
    console.warn(`[webhook] No actions for automation ${automationId}`)
    return
  }

  for (const action of actions) {
    if ((action.delay ?? 0) > 0) {
      console.log(`[webhook] Waiting ${action.delay} min before action`)
      await new Promise(r => setTimeout(r, (action.delay ?? 0) * 60 * 1000))
    }

    let status       = 'success'
    let errorMessage = ''
    let igResponse: unknown = null

    try {
      if (action.type === 'send_dm') {
        console.log(`[webhook] Sending DM to ${recipientId} via ig_account=${igAccountId}`)
        igResponse = await sendDM(recipientId, action.message, accessToken, igAccountId)
        console.log(`[webhook] DM sent OK:`, JSON.stringify(igResponse))
      } else if (action.type === 'reply_comment' && commentId) {
        igResponse = await replyComment(commentId, action.message, accessToken)
      }
    } catch (err: unknown) {
      status       = 'failed'
      errorMessage = err instanceof Error ? err.message : String(err)
      console.error(`[webhook] Action ${action.type} FAILED:`, errorMessage)
    }

    const { error: logErr } = await db.from('automation_logs').insert({
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
    if (logErr) console.error('[webhook] Failed to insert log:', logErr.message)
  }

  await Promise.resolve(
    db.rpc('increment_automation_runs', { automation_id: automationId })
  )
    .then(() => console.log(`[webhook] Run counter incremented for ${automationId}`))
    .catch(e  => console.error('[webhook] increment_automation_runs failed:', e))
}

async function sendDM(
  recipientId: string,
  message: string,
  accessToken: string,
  igAccountId: string
) {
  const url = `${IG_API}/${igAccountId}/messages`
  console.log(`[webhook] POST ${url}`)
  const res = await fetch(url, {
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
