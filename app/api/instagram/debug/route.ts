import { NextRequest, NextResponse } from 'next/server'

// Temporary debug endpoint — visit /api/instagram/debug to see what's in your cookie
// and whether the Instagram API is responding correctly
export async function GET(req: NextRequest) {
  const raw = req.cookies.get('ig_session')?.value

  if (!raw) {
    return NextResponse.json({ step: 'NO_COOKIE', message: 'ig_session cookie not found' })
  }

  let session: { token?: string; igUserId?: string; connectedAt?: string }
  try {
    session = JSON.parse(raw)
  } catch {
    return NextResponse.json({ step: 'PARSE_ERROR', raw: raw.slice(0, 100) })
  }

  const { token, igUserId } = session
  if (!token || !igUserId) {
    return NextResponse.json({ step: 'MISSING_FIELDS', session })
  }

  // Try calling Instagram API
  try {
    const profileRes = await fetch(
      `https://graph.instagram.com/v21.0/${igUserId}?fields=username,followers_count,media_count&access_token=${token}`
    )
    const profileText = await profileRes.text()
    let profile
    try { profile = JSON.parse(profileText) } catch { profile = profileText }

    return NextResponse.json({
      step: 'API_CALLED',
      cookieSize: raw.length,
      igUserId,
      connectedAt: session.connectedAt,
      tokenPreview: token.slice(0, 20) + '...',
      apiStatus: profileRes.status,
      apiResponse: profile,
    })
  } catch (err) {
    return NextResponse.json({ step: 'FETCH_ERROR', error: String(err) })
  }
}
