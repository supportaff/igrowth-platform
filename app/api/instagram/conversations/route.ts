import { NextRequest, NextResponse } from 'next/server'

const IG_API = 'https://graph.instagram.com/v21.0'

async function igFetch(url: string) {
  const res = await fetch(url)
  const json = await res.json()
  if (json.error) throw new Error(json.error.message ?? 'Instagram API error')
  return json
}

// GET /api/instagram/conversations
// Returns list of DM conversations for the connected IG account
export async function GET(req: NextRequest) {
  const raw = req.cookies.get('ig_session')?.value
  if (!raw) return NextResponse.json({ error: 'not_connected' }, { status: 401 })

  let session: { token?: string; igUserId?: string }
  try { session = JSON.parse(raw) } catch {
    return NextResponse.json({ error: 'invalid_session' }, { status: 400 })
  }

  const { token, igUserId } = session
  if (!token || !igUserId) {
    return NextResponse.json({ error: 'missing_credentials' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const threadId = searchParams.get('thread')

  try {
    if (threadId) {
      // ── Fetch messages inside a single thread ──────────────
      const data = await igFetch(
        `${IG_API}/${threadId}/messages?fields=id,message,from,created_time&limit=30&access_token=${token}`
      )
      return NextResponse.json({ messages: data.data ?? [] })
    }

    // ── Fetch conversation list ────────────────────────────
    const data = await igFetch(
      `${IG_API}/${igUserId}/conversations?platform=instagram&fields=id,snippet,updated_time,message_count,unread_count,participants&access_token=${token}`
    )

    const conversations = (data.data ?? []).map((c: {
      id: string
      snippet: string
      updated_time: string
      message_count: number
      unread_count: number
      participants?: { data: Array<{ id: string; username?: string; name?: string }> }
    }) => {
      // Find the other participant (not the IG account itself)
      const other = (c.participants?.data ?? []).find((p) => p.id !== igUserId)
      return {
        id:            c.id,
        snippet:       c.snippet ?? '',
        updatedTime:   c.updated_time,
        messageCount:  c.message_count ?? 0,
        unreadCount:   c.unread_count ?? 0,
        participantId: other?.id ?? '',
        participantName: other?.username ?? other?.name ?? 'Instagram User',
      }
    })

    return NextResponse.json({ connected: true, conversations })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown error'
    console.error('[conversations]', msg)

    // instagram_messaging permission not granted — return a clear flag
    if (msg.includes('permission') || msg.includes('OAuthException')) {
      return NextResponse.json(
        { error: 'permission_required', message: msg },
        { status: 403 }
      )
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// POST /api/instagram/conversations
// Send a DM reply { recipientId, message }
export async function POST(req: NextRequest) {
  const raw = req.cookies.get('ig_session')?.value
  if (!raw) return NextResponse.json({ error: 'not_connected' }, { status: 401 })

  let session: { token?: string; igUserId?: string }
  try { session = JSON.parse(raw) } catch {
    return NextResponse.json({ error: 'invalid_session' }, { status: 400 })
  }

  const { token, igUserId } = session
  if (!token || !igUserId) {
    return NextResponse.json({ error: 'missing_credentials' }, { status: 401 })
  }

  const { recipientId, message } = await req.json()
  if (!recipientId || !message?.trim()) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  const res = await fetch(`${IG_API}/${igUserId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient:    { id: recipientId },
      message:      { text: message },
      access_token: token,
    }),
  })
  const json = await res.json()
  if (!res.ok || json.error) {
    return NextResponse.json({ error: json.error?.message ?? 'send failed' }, { status: 500 })
  }
  return NextResponse.json({ success: true, messageId: json.message_id })
}
