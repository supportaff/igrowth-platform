import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code     = searchParams.get('code')
  const userId   = searchParams.get('state')
  const errorMsg = searchParams.get('error_description')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://igrowth-platform.vercel.app'

  if (errorMsg || !code) {
    console.warn('Instagram OAuth cancelled or error:', errorMsg)
    return NextResponse.redirect(new URL('/dashboard/settings?tab=instagram&error=cancelled', baseUrl))
  }

  const appId       = process.env.INSTAGRAM_APP_ID!
  const appSecret   = process.env.INSTAGRAM_APP_SECRET!
  const redirectUri = `${baseUrl}/api/instagram/callback`

  try {
    // Step 1: Short-lived token
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
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
    if (tokenData.error_type || tokenData.error) {
      console.error('Token exchange error:', tokenData)
      return NextResponse.redirect(new URL('/dashboard/settings?tab=instagram&error=token_failed', baseUrl))
    }

    const shortToken: string = tokenData.access_token
    const igUserId: string   = tokenData.user_id?.toString()

    // Step 2: Long-lived token (60 days)
    const longRes  = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`)
    const longData = await longRes.json()
    if (longData.error) {
      console.error('Long-lived token error:', longData)
      return NextResponse.redirect(new URL('/dashboard/settings?tab=instagram&error=token_exchange_failed', baseUrl))
    }
    const longToken: string = longData.access_token

    // Step 3: Profile
    const profileRes = await fetch(
      `https://graph.instagram.com/v21.0/${igUserId}?fields=username,followers_count,media_count,profile_picture_url,biography,website&access_token=${longToken}`
    )
    const profile = await profileRes.json()
    if (profile.error) {
      console.error('Profile fetch error:', profile.error)
      return NextResponse.redirect(new URL('/dashboard/settings?tab=instagram&error=profile_failed', baseUrl))
    }

    // Step 4: Recent media (last 8 posts)
    const mediaRes = await fetch(
      `https://graph.instagram.com/v21.0/${igUserId}/media?fields=id,caption,media_type,thumbnail_url,media_url,timestamp,like_count,comments_count,permalink&limit=8&access_token=${longToken}`
    )
    const mediaData = await mediaRes.json()
    const posts = mediaData.data ?? []

    // Step 5: Compute engagement rate from real posts
    const totalInteractions = posts.reduce((sum: number, p: Record<string, number>) => sum + (p.like_count || 0) + (p.comments_count || 0), 0)
    const avgInteractions   = posts.length ? totalInteractions / posts.length : 0
    const engagementRate    = profile.followers_count ? ((avgInteractions / profile.followers_count) * 100).toFixed(2) : '0.00'

    // Step 6: Build a compact payload to store in a cookie
    const igPayload = JSON.stringify({
      connected:       true,
      igUserId,
      handle:          profile.username,
      followers:       profile.followers_count ?? 0,
      mediaCount:      profile.media_count     ?? 0,
      bio:             profile.biography        ?? '',
      website:         profile.website          ?? '',
      profilePic:      profile.profile_picture_url ?? '',
      engagementRate,
      posts,
      token:           longToken,
      connectedAt:     new Date().toISOString(),
      clerkUserId:     userId ?? '',
    })

    // Store in an httpOnly cookie (7 days)
    const response = NextResponse.redirect(new URL('/dashboard?ig=connected', baseUrl))
    response.cookies.set('ig_session', igPayload, {
      httpOnly: true,
      secure:   true,
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7, // 7 days
      path:     '/',
    })

    console.log(`✅ Instagram connected: @${profile.username} (${profile.followers_count} followers)`)
    return response
  } catch (err) {
    console.error('Instagram OAuth error:', err)
    return NextResponse.redirect(new URL('/dashboard/settings?tab=instagram&error=server_error', baseUrl))
  }
}
