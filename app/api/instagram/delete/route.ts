import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Meta calls this URL when a user requests data deletion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    console.log('Instagram data deletion request:', body)

    // TODO: Delete all data associated with body.user_id from your DB

    // Meta requires a confirmation URL and a confirmation code in response
    const confirmationCode = crypto.randomBytes(16).toString('hex')
    const statusUrl = `https://igrowth-platform.vercel.app/privacy?deletion=${confirmationCode}`

    return NextResponse.json({
      url: statusUrl,
      confirmation_code: confirmationCode,
    })
  } catch (err) {
    console.error('Data deletion callback error:', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
