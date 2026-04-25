import { NextRequest, NextResponse } from 'next/server'

// Call this route via a cron job every 30 days to refresh long-lived tokens
// e.g. Vercel Cron: GET /api/instagram/refresh
export async function GET(req: NextRequest) {
  // TODO: Fetch all users with ig_long_lived_token from DB
  // For each user, call the refresh endpoint:
  // GET https://graph.facebook.com/v19.0/oauth/access_token
  //   ?grant_type=ig_refresh_token
  //   &access_token=EXISTING_LONG_LIVED_TOKEN
  // Then update token_expires_at in DB

  return NextResponse.json({ message: 'Token refresh endpoint ready. Wire up your DB to activate.' })
}
