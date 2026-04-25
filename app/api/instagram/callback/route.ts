import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code     = searchParams.get('code')
  const userId   = searchParams.get('state')
  const errorMsg = searchParams.get('error_description')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://igrowth-platform.vercel.app'

  if (errorMsg || !code) {
    console.warn('Instagram OAuth cancelled or error:', errorMsg)
    return NextResponse.redirect(
      new URL('/dashboard/settings?tab=instagram&error=cancelled', baseUrl)
    )
  }

  if (!userId) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?tab=instagram&error=missing_user', baseUrl)
    )
  }

  // Instagram Business Login uses a different App ID than the Facebook App ID
  const appId       = process.env.INSTAGRAM_APP_ID!        // 2055466755851662
  const appSecret   = process.env.INSTAGRAM_APP_SECRET!    // Instagram app secret
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI!  // https://igrowth-platform.vercel.app/api/instagram/callback

  try {
    // Step 1: Exchange code -> short-lived access token (Instagram Business Login endpoint)
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
      console.error('Instagram token exchange error:', tokenData)
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=instagram&error=token_failed', baseUrl)
      )
    }

    const shortToken: string  = tokenData.access_token
    const igUserId: string    = tokenData.user_id?.toString()

    // Step 2: Exchange short-lived -> long-lived token (60 days)
    const longRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`
    )
    const longData = await longRes.json()

    if (longData.error) {
      console.error('Long-lived token error:', longData.error)
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=instagram&error=token_exchange_failed', baseUrl)
      )
    }

    const longToken: string = longData.access_token

    // Step 3: Get Instagram profile
    const profileRes = await fetch(
      `https://graph.instagram.com/v21.0/${igUserId}?fields=username,followers_count,media_count,profile_picture_url&access_token=${longToken}`
    )
    const profile = await profileRes.json()

    if (profile.error) {
      console.error('Instagram profile fetch error:', profile.error)
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=instagram&error=profile_failed', baseUrl)
      )
    }

    const igHandle: string    = profile.username ?? 'unknown'
    const igFollowers: number = profile.followers_count ?? 0

    // TODO: Save to your DB here
    // await saveInstagramConnection({ userId, igUserId, igHandle, igFollowers, longToken })

    console.log(`Instagram connected: @${igHandle} (${igFollowers} followers) for user ${userId}`)

    return NextResponse.redirect(
      new URL(
        `/dashboard/settings?tab=instagram&connected=true&handle=${igHandle}&followers=${igFollowers}`,
        baseUrl
      )
    )
  } catch (err) {
    console.error('Instagram OAuth error:', err)
    return NextResponse.redirect(
      new URL('/dashboard/settings?tab=instagram&error=server_error', baseUrl)
    )
  }
}
