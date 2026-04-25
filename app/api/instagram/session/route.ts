import { NextRequest, NextResponse } from 'next/server'

// Client-side fetches this to get current Instagram session
export async function GET(req: NextRequest) {
  const raw = req.cookies.get('ig_session')?.value
  if (!raw) return NextResponse.json({ connected: false })
  try {
    const session = JSON.parse(raw)
    // Never expose the token to the client
    const { token: _token, ...safe } = session
    return NextResponse.json(safe)
  } catch {
    return NextResponse.json({ connected: false })
  }
}

// Disconnect: clear the cookie
export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('ig_session', '', { maxAge: 0, path: '/' })
  return res
}
