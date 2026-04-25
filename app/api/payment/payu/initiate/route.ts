import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// ───────────────────────────────────────────────────────────────────
// PayU config
// Set PAYU_ENV=live in Vercel to go live — key/salt variable names stay the same.
// Just replace the VALUES of PAYU_KEY and PAYU_SALT with your live credentials.
// ───────────────────────────────────────────────────────────────────
const IS_LIVE = process.env.PAYU_ENV === 'live'

const PAYU_URL = IS_LIVE
  ? 'https://secure.payu.in/_payment'   // live
  : 'https://test.payu.in/_payment'     // test

// Single set of env vars — just swap the VALUES when going live
const MERCHANT_KEY  = process.env.PAYU_KEY!
const MERCHANT_SALT = process.env.PAYU_SALT!

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

function generateHash(params: {
  key: string; txnid: string; amount: string; productinfo: string;
  firstname: string; email: string; salt: string;
}): string {
  // PayU hash formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1-udf5||||||salt)
  const str = [
    params.key, params.txnid, params.amount, params.productinfo,
    params.firstname, params.email,
    '', '', '', '', '',   // udf1–udf5
    '', '', '', '', '',   // blank fields
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

    let email  = bodyEmail  ?? ''
    let name   = bodyName   ?? ''
    let phone  = bodyPhone  ?? ''
    let userId = bodyUserId ?? ''

    // Fallback: pull user from session (dashboard flow where fields may be empty)
    if (!email || !userId) {
      const supabase = createRouteHandlerClient({ cookies })
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        userId = userId || user.id
        email  = email  || user.email  || ''
        name   = name   || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
        phone  = phone  || user.user_metadata?.phone     || '9999999999'
      }
    }

    if (!email) return NextResponse.json({ error: 'User email is required' }, { status: 400 })

    const txnid     = `IGP_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const amountStr = Number(amount).toFixed(2)
    const firstname = (name as string).split(' ')[0] || 'User'

    const hash = generateHash({
      key: MERCHANT_KEY, txnid, amount: amountStr,
      productinfo: planName, firstname, email,
      salt: MERCHANT_SALT,
    })

    // Persist pending order
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.from('payment_orders').insert({
      txnid, user_id: userId, plan_id: planId,
      billing, amount: Number(amountStr), plan_name: planName,
      status: 'pending', environment: IS_LIVE ? 'live' : 'test',
    })

    const fields: Record<string, string> = {
      key:              MERCHANT_KEY,
      txnid,
      amount:           amountStr,
      productinfo:      planName,
      firstname,
      email,
      phone:            phone || '9999999999',
      surl:             `${BASE_URL}/api/payment/payu/success`,
      furl:             `${BASE_URL}/api/payment/payu/failure`,
      hash,
      service_provider: 'payu_paisa',
    }

    return NextResponse.json({ payuUrl: PAYU_URL, fields })
  } catch (err) {
    console.error('[PayU Initiate]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
