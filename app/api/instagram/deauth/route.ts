import { NextRequest, NextResponse } from 'next/server'

// Meta calls this URL when a user deauthorizes the app
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    console.log('Instagram deauthorize callback:', body)
    // TODO: Remove user's Instagram tokens from your DB using body.user_id
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Deauth callback error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
