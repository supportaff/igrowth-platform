import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const raw = req.cookies.get('ig_session')?.value
  if (!raw) {
    console.log('insights: no ig_session cookie')
    return NextResponse.json({ error: 'not_connected' }, { status: 401 })
  }

  let session: { token?: string; igUserId?: string }
  try { session = JSON.parse(raw) } catch {
    return NextResponse.json({ error: 'invalid_session' }, { status: 400 })
  }

  const { token, igUserId } = session
  if (!token || !igUserId) {
    console.log('insights: token or igUserId missing in cookie')
    return NextResponse.json({ error: 'missing_credentials' }, { status: 401 })
  }

  try {
    // Fetch profile + recent media in parallel
    const [profileRes, mediaRes] = await Promise.all([
      fetch(
        `https://graph.instagram.com/v21.0/${igUserId}?fields=username,followers_count,media_count,profile_picture_url,biography,website&access_token=${token}`
      ),
      fetch(
        `https://graph.instagram.com/v21.0/${igUserId}/media?fields=id,caption,media_type,thumbnail_url,media_url,timestamp,like_count,comments_count,permalink&limit=12&access_token=${token}`
      ),
    ])

    const profile   = await profileRes.json()
    const mediaData = await mediaRes.json()

    if (profile.error) {
      console.error('Profile API error:', profile.error)
      // Token may have expired
      return NextResponse.json(
        { error: profile.error.message, code: profile.error.code },
        { status: 401 }
      )
    }

    const posts = mediaData.data ?? []

    const totalInteractions = posts.reduce(
      (sum: number, p: { like_count?: number; comments_count?: number }) =>
        sum + (p.like_count ?? 0) + (p.comments_count ?? 0),
      0
    )
    const avgInteractions = posts.length ? totalInteractions / posts.length : 0
    const engagementRate  = profile.followers_count
      ? ((avgInteractions / profile.followers_count) * 100).toFixed(2)
      : '0.00'

    return NextResponse.json({
      connected:      true,
      handle:         profile.username          ?? '',
      followers:      profile.followers_count   ?? 0,
      mediaCount:     profile.media_count       ?? 0,
      bio:            profile.biography         ?? '',
      website:        profile.website           ?? '',
      profilePic:     profile.profile_picture_url ?? '',
      engagementRate,
      posts,
    })
  } catch (err) {
    console.error('Insights fetch error:', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
