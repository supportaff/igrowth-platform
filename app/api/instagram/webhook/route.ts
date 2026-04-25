import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN ?? 'igrowth_verify_2026'
const IG_API = 'https://graph.instagram.com/v21.0'

// ── GET: Meta webhook verification handshake ──────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[webhook] Meta verification successful')
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// ── POST: Incoming Instagram events ──────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[webhook] Received event:', JSON.stringify(body, null, 2))

    const entries = body.entry ?? []

    for (const entry of entries) {
      const igAccountId = entry.id

      // Get Instagram account + access token from DB
      const { data: account } = await supabase
        .from('instagram_accounts')
        .select('user_id, access_token, ig_user_id')
        .eq('ig_user_id', igAccountId)
        .single()

      if (!account) continue

      // Fetch all active automations for this user
      const { data: automations } = await supabase
        .from('automations')
        .select('*')
        .eq('user_id', account.user_id)
        .eq('status', 'active')

      if (!automations?.length) continue

      // ── Handle DM messages ──
      const messagingEvents = entry.messaging ?? []
      for (const event of messagingEvents) {
        const senderId = event.sender?.id
        const messageText = event.message?.text ?? ''
        if (!senderId || !messageText) continue

        // Skip messages sent by the bot itself
        if (senderId === igAccountId) continue

        for (const auto of automations) {
          if (auto.trigger !== 'dm_keyword') continue
          const keywords: string[] = auto.keywords ?? []
          const matched = keywords.length === 0 || keywords.some((kw: string) =>
            messageText.toLowerCase().includes(kw.toLowerCase())
          )
          if (!matched) continue
          await executeActions(auto.actions, senderId, account.access_token, account.ig_user_id, supabase, auto.id)
        }
      }

      // ── Handle comments ──
      const changes = entry.changes ?? []
      for (const change of changes) {
        if (change.field !== 'comments') continue
        const commentText = change.value?.text ?? ''
        const commenterId = change.value?.from?.id
        const commentId   = change.value?.id
        if (!commenterId || commenterId === igAccountId) continue

        for (const auto of automations) {
          if (!['post_comment', 'reel_comment'].includes(auto.trigger)) continue
          const keywords: string[] = auto.keywords ?? []
          const matched = keywords.length === 0 || keywords.some((kw: string) =>
            commentText.toLowerCase().includes(kw.toLowerCase())
          )
          if (!matched) continue
          await executeActions(auto.actions, commenterId, account.access_token, account.ig_user_id, supabase, auto.id, commentId)
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('[webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// ── Execute automation actions ────────────────────────────
async function executeActions(
  actions: Array<{ type: string; message: string; delay: number; tag?: string }>,
  recipientId: string,
  accessToken: string,
  igAccountId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: SupabaseClient<any, any, any>,
  automationId: string,
  commentId?: string
) {
  for (const action of actions) {
    if (action.delay > 0) {
      await new Promise(r => setTimeout(r, action.delay * 60 * 1000))
    }

    try {
      if (action.type === 'send_dm') {
        await sendDM(recipientId, action.message, accessToken, igAccountId)
      }

      if (action.type === 'reply_comment' && commentId) {
        await replyComment(commentId, action.message, accessToken)
      }
    } catch (err) {
      console.error(`[webhook] Action ${action.type} failed:`, err)
    }
  }

  // Increment run count
  await db.rpc('increment_automation_runs', { automation_id: automationId }).catch(() => null)
}

async function sendDM(recipientId: string, message: string, accessToken: string, igAccountId: string) {
  const res = await fetch(`${IG_API}/${igAccountId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text: message },
      access_token: accessToken,
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(json))
  return json
}

async function replyComment(commentId: string, message: string, accessToken: string) {
  const res = await fetch(`${IG_API}/${commentId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, access_token: accessToken }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(json))
  return json
}
