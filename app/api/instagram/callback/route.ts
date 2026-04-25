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

  const appId       = process.env.INSTAGRAM_APP_ID!
  const appSecret   = process.env.INSTAGRAM_APP_SECRET!
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI!

  try {
    // Step 1: Exchange code -> short-lived user access token
    const tokenRes = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     appId,
        client_secret: appSecret,
        redirect_uri:  redirectUri,
        code,
      }),
    })
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      console.error('Token exchange error:', tokenData.error)
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=instagram&error=token_failed', baseUrl)
      )
    }

    const shortToken: string = tokenData.access_token

    // Step 2: Exchange short-lived -> long-lived token (60 days)
    const longRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`
    )
    const longData = await longRes.json()
    const longToken: string = longData.access_token

    // Step 3: Get Facebook Pages linked to the user
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${longToken}`
    )
    const pagesData = await pagesRes.json()

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=instagram&error=no_pages', baseUrl)
      )
    }

    const page = pagesData.data[0]
    const pageAccessToken: string = page.access_token

    // Step 4: Get Instagram Business Account ID from Page
    const igRes = await fetch(
      `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${pageAccessToken}`
    )
    const igData = await igRes.json()

    if (!igData.instagram_business_account?.id) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=instagram&error=no_ig_account', baseUrl)
      )
    }

    const igAccountId: string = igData.instagram_business_account.id

    // Step 5: Get Instagram profile using new scope fields
    const profileRes = await fetch(
      `https://graph.facebook.com/v21.0/${igAccountId}?fields=username,followers_count,media_count,profile_picture_url&access_token=${pageAccessToken}`
    )
    const profile = await profileRes.json()

    const igHandle: string     = profile.username ?? 'unknown'
    const igFollowers: number  = profile.followers_count ?? 0

    // TODO: Save to your DB here
    // await saveInstagramConnection({ userId, igAccountId, igHandle, igFollowers, pageAccessToken, longToken })

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
