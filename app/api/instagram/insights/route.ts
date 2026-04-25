import { NextRequest, NextResponse } from 'next/server'

// Returns live Instagram insights using the stored token
export async function GET(req: NextRequest) {
  const raw = req.cookies.get('ig_session')?.value
  if (!raw) return NextResponse.json({ error: 'not_connected' }, { status: 401 })

  let session: Record<string, string>
  try { session = JSON.parse(raw) } catch { return NextResponse.json({ error: 'invalid_session' }, { status: 400 }) }

  const { token, igUserId } = session
  if (!token || !igUserId) return NextResponse.json({ error: 'missing_token' }, { status: 401 })

  try {
    // Fetch profile + recent 12 posts in parallel
    const [profileRes, mediaRes] = await Promise.all([
      fetch(`https://graph.instagram.com/v21.0/${igUserId}?fields=username,followers_count,media_count,profile_picture_url,biography,website&access_token=${token}`),
      fetch(`https://graph.instagram.com/v21.0/${igUserId}/media?fields=id,caption,media_type,thumbnail_url,media_url,timestamp,like_count,comments_count,permalink&limit=12&access_token=${token}`),
    ])

    const profile   = await profileRes.json()
    const mediaData = await mediaRes.json()
    const posts     = mediaData.data ?? []

    if (profile.error) return NextResponse.json({ error: profile.error.message }, { status: 400 })

    const totalInteractions = posts.reduce((sum: number, p: Record<string, number>) => sum + (p.like_count || 0) + (p.comments_count || 0), 0)
    const avgInteractions   = posts.length ? totalInteractions / posts.length : 0
    const engagementRate    = profile.followers_count
      ? ((avgInteractions / profile.followers_count) * 100).toFixed(2)
      : '0.00'

    return NextResponse.json({
      handle:         profile.username,
      followers:      profile.followers_count ?? 0,
      mediaCount:     profile.media_count     ?? 0,
      bio:            profile.biography        ?? '',
      website:        profile.website          ?? '',
      profilePic:     profile.profile_picture_url ?? '',
      engagementRate,
      posts,
    })
  } catch (err) {
    console.error('Insights fetch error:', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
