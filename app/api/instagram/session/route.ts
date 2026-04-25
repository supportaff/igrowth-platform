import { NextRequest, NextResponse } from 'next/server'

// Returns whether a valid ig_session cookie exists (never exposes token)
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
    // Never expose the token to the browser
    return NextResponse.json({
      connected:   true,
      igUserId:    session.igUserId,
      connectedAt: session.connectedAt,
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
