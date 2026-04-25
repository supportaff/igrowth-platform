import { NextRequest, NextResponse } from 'next/server'

// GET /api/instagram/session — returns session info including platformUserId
export async function GET(req: NextRequest) {
  const raw = req.cookies.get('ig_session')?.value
  if (!raw) {
    console.log('ig_session: no cookie found')
    return NextResponse.json({ connected: false })
  }
  try {
    const session = JSON.parse(raw)
    if (!session.token || !session.igUserId) {
      console.log('ig_session: cookie present but missing token/userId')
      return NextResponse.json({ connected: false })
    }
    // Return platformUserId so the automations page uses the correct user_id
    // platformUserId = clerkUserId if available, else igUserId
    return NextResponse.json({
      connected:      true,
      igUserId:       session.igUserId,
      // KEY FIX: expose platformUserId for automations user_id keying
      user_id:        session.platformUserId ?? session.igUserId,
      username:       session.username ?? '',
      connectedAt:    session.connectedAt,
    })
  } catch {
    return NextResponse.json({ connected: false })
  }
}

// DELETE /api/instagram/session — disconnect
export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('ig_session', '', { maxAge: 0, path: '/' })
  return res
}
