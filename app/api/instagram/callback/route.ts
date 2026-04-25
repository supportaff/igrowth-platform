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
    const tokenData = await tokenRes.json()
    console.log('Token exchange response:', JSON.stringify(tokenData).slice(0, 200))

    if (tokenData.error_type || tokenData.error) {
      console.error('Token exchange error:', tokenData)
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=instagram&error=token_failed', baseUrl)
      )
    }

    const shortToken: string = tokenData.access_token
    const igUserId: string   = String(tokenData.user_id)

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

    // ── Step 3: Store ONLY the minimal identifiers in the cookie (<500 bytes) ─
    // Full profile + posts are fetched live by /api/instagram/insights
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
      maxAge:   60 * 60 * 24 * 60, // 60 days (matches token lifetime)
      path:     '/',
    })

    console.log(`✅ ig_session cookie set for user ${igUserId}`)
    return response
  } catch (err) {
    console.error('Instagram OAuth error:', err)
    return NextResponse.redirect(
      new URL('/dashboard/settings?tab=instagram&error=server_error', baseUrl)
    )
  }
}
