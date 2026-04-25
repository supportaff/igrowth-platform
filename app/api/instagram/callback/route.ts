import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

  const appId       = process.env.INSTAGRAM_APP_ID!
  const appSecret   = process.env.INSTAGRAM_APP_SECRET!
  const redirectUri = `${baseUrl}/api/instagram/callback`

  if (!appId || !appSecret) {
    console.error('INSTAGRAM_APP_ID or INSTAGRAM_APP_SECRET env vars missing')
    return NextResponse.redirect(
      new URL('/dashboard/settings?tab=instagram&error=server_config', baseUrl)
    )
  }

  try {
    // ── Step 1: Short-lived token ─────────────────────────────────────────
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
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

    // Parse as text first to safely extract user_id without float64 precision loss
    const tokenRaw    = await tokenRes.text()
    console.log('Token exchange raw response:', tokenRaw.slice(0, 300))

    const userIdMatch = tokenRaw.match(/"user_id"\s*:\s*(\d+)/)
    const rawUserId   = userIdMatch?.[1] ?? null

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

    // ── Step 2: Long-lived token (60 days) ───────────────────────────────
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

    // ── Step 3: Resolve igUserId ─────────────────────────────────────────
    let igUserId: string
    if (rawUserId) {
      igUserId = rawUserId
      console.log(`User ID from token response (safe string): ${igUserId}`)
    } else {
      const meRes  = await fetch(`https://graph.instagram.com/v21.0/me?fields=id,username&access_token=${longToken}`)
      const meData = await meRes.json()
      if (meData.error || !meData.id) {
        console.error('/me endpoint error:', meData)
        return NextResponse.redirect(
          new URL('/dashboard/settings?tab=instagram&error=me_failed', baseUrl)
        )
      }
      igUserId = String(meData.id)
      console.log(`User ID from /me endpoint: ${igUserId}`)
    }

    // ── Step 4: Fetch username for display ──────────────────────────────
    let username = ''
    try {
      const meRes  = await fetch(`https://graph.instagram.com/v21.0/me?fields=id,username&access_token=${longToken}`)
      const meData = await meRes.json()
      username = meData.username ?? ''
    } catch { /* non-fatal */ }

    // ── Step 5: Determine the platform user_id to store ─────────────────
    // Use clerkUserId from state param if present, otherwise fall back to igUserId
    // This is the key fix: automations are keyed by this same user_id
    const platformUserId = userId && userId !== 'null' && userId !== '' ? userId : igUserId

    // ── Step 6: Upsert into instagram_accounts table ─────────────────────
    // This is what the webhook uses to look up the access token
    const { error: upsertError } = await supabase
      .from('instagram_accounts')
      .upsert(
        {
          ig_user_id:   igUserId,
          user_id:      platformUserId,
          access_token: longToken,
          username:     username,
          connected_at: new Date().toISOString(),
          updated_at:   new Date().toISOString(),
        },
        { onConflict: 'ig_user_id' }
      )

    if (upsertError) {
      console.error('Failed to upsert instagram_accounts:', upsertError)
      // Non-fatal: still set cookie and redirect — log but continue
    } else {
      console.log(`✅ instagram_accounts upserted: ig_user_id=${igUserId}, user_id=${platformUserId}`)
    }

    // ── Step 7: Set cookie ───────────────────────────────────────────────
    const cookiePayload = JSON.stringify({
      igUserId,
      platformUserId,
      token:       longToken,
      username,
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

    console.log(`✅ ig_session cookie set for igUserId=${igUserId}, platformUserId=${platformUserId}`)
    return response
  } catch (err) {
    console.error('Instagram OAuth error:', err)
    return NextResponse.redirect(
      new URL('/dashboard/settings?tab=instagram&error=server_error', baseUrl)
    )
  }
}
