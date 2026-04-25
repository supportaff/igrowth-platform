import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/instagram/whoami
 * Validates the stored ig_session cookie by trying multiple
 * Instagram Graph API endpoints to identify what type of ID was stored.
 */
export async function GET(req: NextRequest) {
  const raw = req.cookies.get('ig_session')?.value
  if (!raw) return NextResponse.json({ error: 'NO_COOKIE' }, { status: 401 })

  let session: { token?: string; igUserId?: string }
  try { session = JSON.parse(raw) } catch {
    return NextResponse.json({ error: 'PARSE_ERROR' }, { status: 400 })
  }

  const { token, igUserId } = session
  if (!token || !igUserId) {
    return NextResponse.json({ error: 'MISSING_FIELDS', session }, { status: 400 })
  }

  const results: Record<string, unknown> = {
    storedUserId: igUserId,
    idLength: igUserId.length,
    tokenPreview: token.slice(0, 20) + '...',
  }

  // Test 1: /me — basic token info
  try {
    const r = await fetch(`https://graph.instagram.com/v21.0/me?fields=id,username,account_type&access_token=${token}`)
    results.meEndpoint = await r.json()
  } catch (e) {
    results.meEndpoint = { fetchError: String(e) }
  }

  // Test 2: /{igUserId} with basic fields
  try {
    const r = await fetch(`https://graph.instagram.com/v21.0/${igUserId}?fields=id,username,account_type,followers_count&access_token=${token}`)
    results.directIdEndpoint = await r.json()
  } catch (e) {
    results.directIdEndpoint = { fetchError: String(e) }
  }

  // Test 3: token debug — check what permissions the token actually has
  // NOTE: requires app secret, skip if not available
  const appId     = process.env.INSTAGRAM_APP_ID     || process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID
  const appSecret = process.env.INSTAGRAM_APP_SECRET
  if (appId && appSecret) {
    try {
      const r = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${appId}|${appSecret}`
      )
      results.tokenDebug = await r.json()
    } catch (e) {
      results.tokenDebug = { fetchError: String(e) }
    }
  } else {
    results.tokenDebug = 'SKIPPED — INSTAGRAM_APP_SECRET not set in env'
  }

  return NextResponse.json(results, { status: 200 })
}
