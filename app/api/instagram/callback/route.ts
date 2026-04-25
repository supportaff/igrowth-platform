import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code     = searchParams.get('code')
  const userId   = searchParams.get('state')
  const errorMsg = searchParams.get('error_description')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://igrowth-platform.vercel.app'

  if (errorMsg || !code) {
    console.warn('Instagram OAuth cancelled/error:', errorMsg)
    return NextResponse.redirect(
      new URL(`/dashboard/settings?tab=instagram&error=${encodeURIComponent(errorMsg ?? 'cancelled')}`, baseUrl)
    )
  }

  const appId      = process.env.INSTAGRAM_APP_ID!
  const appSecret  = process.env.INSTAGRAM_APP_SECRET!
  const redirectUri = `${baseUrl}/api/instagram/callback`

  if (!appId || !appSecret) {
    console.error('INSTAGRAM_APP_ID or INSTAGRAM_APP_SECRET env vars missing')
    return NextResponse.redirect(
      new URL('/dashboard/settings?tab=instagram&error=server_config', baseUrl)
    )
  }

  try {
    // ── Step 1: Short-lived token ────────────────────────────────────────────
    const tokenRes  = await fetch('https://api.instagram.com/oauth/access_token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     appId,
        client_secret: appSecret,
        grant_type:    'authorization_code',
        redirect_uri:  redirectUri,
        code,
      }),
    })

    // ⚠️ IMPORTANT: parse as TEXT first, then extract user_id as a string
    // using regex to avoid JavaScript number precision loss on large int IDs.
    // JSON.parse / res.json() coerces user_id to a JS number (float64),
    // which corrupts IDs > 2^53 (e.g. 25997062846640488 becomes 25997062846640490)
    const tokenRaw  = await tokenRes.text()
    console.log('Token exchange raw response:', tokenRaw.slice(0, 300))

    // Extract user_id as raw string before any JSON parsing
    const userIdMatch = tokenRaw.match(/"user_id"\s*:\s*(\d+)/)
    const rawUserId   = userIdMatch?.[1] ?? null

    // Parse the rest normally (access_token is a string, safe to JSON.parse)
    let tokenData: { access_token?: string; error_type?: string; error?: string }
    try { tokenData = JSON.parse(tokenRaw) } catch {
      console.error('Token response parse error:', tokenRaw)
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=instagram&error=token_parse_failed', baseUrl)
      )
    }

    if (tokenData.error_type || tokenData.error) {
      console.error('Token exchange error:', tokenData)
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=instagram&error=token_failed', baseUrl)
      )
    }

    const shortToken: string = tokenData.access_token!

    // ── Step 2: Exchange for long-lived token (60 days) ──────────────────────
    const longRes  = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`
    )
    const longData = await longRes.json()
    console.log('Long token response:', JSON.stringify(longData).slice(0, 200))

    if (longData.error) {
      console.error('Long-lived token error:', longData)
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=instagram&error=token_exchange_failed', baseUrl)
      )
    }

    const longToken: string = longData.access_token

    // ── Step 3: Get authoritative user ID from /me (never trust tokenData.user_id) ─
    // /me returns the ID as a JSON string field, not a number, so it's safe.
    let igUserId: string
    if (rawUserId) {
      // Prefer the regex-extracted raw string from the token response
      igUserId = rawUserId
      console.log(`User ID from token response (safe string): ${igUserId}`)
    } else {
      // Fallback: fetch from /me endpoint — always returns id as a string
      const meRes  = await fetch(`https://graph.instagram.com/v21.0/me?fields=id,username&access_token=${longToken}`)
      const meData = await meRes.json()
      if (meData.error || !meData.id) {
        console.error('/me endpoint error:', meData)
        return NextResponse.redirect(
          new URL('/dashboard/settings?tab=instagram&error=me_failed', baseUrl)
        )
      }
      igUserId = String(meData.id) // .id from Graph API is already a string
      console.log(`User ID from /me endpoint: ${igUserId}`)
    }

    // ── Step 4: Store ONLY the minimal identifiers in the cookie (<500 bytes) ─
    const cookiePayload = JSON.stringify({
      igUserId,
      token:       longToken,
      clerkUserId: userId ?? '',
      connectedAt: new Date().toISOString(),
    })

    console.log(`Cookie payload size: ${cookiePayload.length} bytes`)

    const response = NextResponse.redirect(new URL('/dashboard?ig=connected', baseUrl))
    response.cookies.set('ig_session', cookiePayload, {
      httpOnly: true,
      secure:   true,
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 60, // 60 days
      path:     '/',
    })

    console.log(`✅ ig_session cookie set for igUserId=${igUserId}`)
    return response
  } catch (err) {
    console.error('Instagram OAuth error:', err)
    return NextResponse.redirect(
      new URL('/dashboard/settings?tab=instagram&error=server_error', baseUrl)
    )
  }
}
