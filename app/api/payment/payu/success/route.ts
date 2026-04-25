import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const IS_LIVE = process.env.PAYU_ENV === 'live'
const MERCHANT_SALT = IS_LIVE ? process.env.PAYU_LIVE_SALT! : process.env.PAYU_TEST_SALT!
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

// Reverse hash for PayU response verification:
// sha512(salt|status|||||||||||email|firstname|productinfo|amount|txnid|key)
function verifyHash(params: Record<string, string>): boolean {
  const str = [
    MERCHANT_SALT,
    params.status,
    '', '', '', '', '', '', '', '', '',
    params.email,
    params.firstname,
    params.productinfo,
    params.amount,
    params.txnid,
    params.key,
  ].join('|')
  const computed = crypto.createHash('sha512').update(str).digest('hex')
  return computed === params.hash
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const params: Record<string, string> = {}
  formData.forEach((v, k) => { params[k] = String(v) })

  const isValid = verifyHash(params)
  const supabase = createRouteHandlerClient({ cookies })

  // Look up the pending order
  const { data: order } = await supabase
    .from('payment_orders')
    .select()
    .eq('txnid', params.txnid)
    .single()

  if (!order || !isValid || params.status !== 'success') {
    await supabase.from('payment_orders').update({
      status: 'failed',
      payu_response: params,
    }).eq('txnid', params.txnid)
    return NextResponse.redirect(`${BASE_URL}/payment/failed?txnid=${params.txnid}`)
  }

  // Activate subscription
  const now = new Date()
  const expiresAt = new Date(now)
  if (order.billing === 'annual') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1)
  }

  await supabase.from('subscriptions').upsert({
    user_id: order.user_id,
    plan_id: order.plan_id,
    billing: order.billing,
    status: 'active',
    started_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    payu_txnid: params.txnid,
    payu_mihpayid: params.mihpayid ?? null,
  }, { onConflict: 'user_id' })

  await supabase.from('payment_orders').update({
    status: 'success',
    payu_response: params,
    payu_mihpayid: params.mihpayid ?? null,
  }).eq('txnid', params.txnid)

  return NextResponse.redirect(`${BASE_URL}/payment/success?plan=${order.plan_id}`)
}
