import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// ─── PayU config — switch between test/live via env ───────────────────────────
const IS_LIVE = process.env.PAYU_ENV === 'live'

const PAYU_URL = IS_LIVE
  ? 'https://secure.payu.in/_payment'
  : 'https://test.payu.in/_payment'

const MERCHANT_KEY = IS_LIVE
  ? process.env.PAYU_LIVE_KEY!
  : process.env.PAYU_TEST_KEY!

const MERCHANT_SALT = IS_LIVE
  ? process.env.PAYU_LIVE_SALT!
  : process.env.PAYU_TEST_SALT!

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

// ─── Hash generation: sha512(key|txnid|amount|productinfo|firstname|email|||||||||||salt) ───
function generateHash(params: {
  key: string; txnid: string; amount: string; productinfo: string;
  firstname: string; email: string; salt: string;
}): string {
  const str = [
    params.key, params.txnid, params.amount, params.productinfo,
    params.firstname, params.email,
    '', '', '', '', '', '', '', '', // udf1–udf8 (empty for now)
    '',
    params.salt,
  ].join('|')
  return crypto.createHash('sha512').update(str).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      planId, billing, amount, planName,
      userId: bodyUserId, email: bodyEmail,
      name: bodyName, phone: bodyPhone,
    } = body

    // Try to get user from session if not provided (dashboard flow)
    let email = bodyEmail ?? ''
    let name = bodyName ?? ''
    let phone = bodyPhone ?? ''
    let userId = bodyUserId ?? ''

    if (!email || !userId) {
      const supabase = createRouteHandlerClient({ cookies })
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        userId = userId || user.id
        email  = email  || user.email  || ''
        name   = name   || (user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User')
        phone  = phone  || (user.user_metadata?.phone ?? '9999999999')
      }
    }

    if (!email) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 })
    }

    const txnid = `IGP_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const amountStr = String(Number(amount).toFixed(2))
    const firstname = name.split(' ')[0] || 'User'

    const hash = generateHash({
      key: MERCHANT_KEY,
      txnid,
      amount: amountStr,
      productinfo: planName,
      firstname,
      email,
      salt: MERCHANT_SALT,
    })

    // Store pending order in Supabase for verification on callback
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.from('payment_orders').insert({
      txnid,
      user_id: userId,
      plan_id: planId,
      billing,
      amount: Number(amountStr),
      plan_name: planName,
      status: 'pending',
      environment: IS_LIVE ? 'live' : 'test',
    })

    const fields: Record<string, string> = {
      key:         MERCHANT_KEY,
      txnid,
      amount:      amountStr,
      productinfo: planName,
      firstname,
      email,
      phone:       phone || '9999999999',
      surl:        `${BASE_URL}/api/payment/payu/success`,
      furl:        `${BASE_URL}/api/payment/payu/failure`,
      hash,
      service_provider: 'payu_paisa',
    }

    return NextResponse.json({ payuUrl: PAYU_URL, fields })
  } catch (err) {
    console.error('[PayU Initiate]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
