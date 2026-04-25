import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const MERCHANT_SALT = process.env.PAYU_SALT!

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Always derive base URL from the incoming request — never rely on env var
// because PayU POSTs to your production domain but BASE_URL may still be localhost
function getBaseUrl(req: NextRequest): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'https'
  const host  = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? 'localhost:3000'
  return `${proto}://${host}`
}

function verifyHash(params: Record<string, string>): boolean {
  const str = [
    MERCHANT_SALT,
    params.status,
    params.udf5 ?? '', params.udf4 ?? '', params.udf3 ?? '',
    params.udf2 ?? '', params.udf1 ?? '',
    params.email, params.firstname, params.productinfo,
    params.amount, params.txnid, params.key,
  ].join('|')
  const computed = crypto.createHash('sha512').update(str).digest('hex')
  return computed === params.hash
}

export async function POST(req: NextRequest) {
  const BASE_URL = getBaseUrl(req)

  const formData = await req.formData()
  const params: Record<string, string> = {}
  formData.forEach((v, k) => { params[k] = String(v) })

  // Verify hash integrity
  const isValid = verifyHash(params)
  if (!isValid || params.status !== 'success') {
    await supabase.from('payment_orders')
      .update({
        status:         'failed',
        payu_response:  params,
        failure_reason: 'Hash verification failed or status not success',
      })
      .eq('txnid', params.txnid)

    return NextResponse.redirect(
      `${BASE_URL}/payment/failed?txnid=${params.txnid}&reason=${encodeURIComponent('Payment verification failed')}`,
      303
    )
  }

  // Fetch original order
  const { data: order, error: orderErr } = await supabase
    .from('payment_orders')
    .select()
    .eq('txnid', params.txnid)
    .single()

  if (orderErr || !order) {
    return NextResponse.redirect(
      `${BASE_URL}/payment/failed?reason=${encodeURIComponent('Order not found')}`,
      303
    )
  }

  // Calculate subscription expiry
  const now       = new Date()
  const expiresAt = new Date(now)
  if (order.billing === 'annual') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1)
  }

  // Upsert subscription — grants the user their plan
  const { error: subErr } = await supabase.from('subscriptions').upsert(
    {
      user_id:       order.user_id,
      plan_id:       order.plan_id,
      billing:       order.billing,
      status:        'active',
      started_at:    now.toISOString(),
      expires_at:    expiresAt.toISOString(),
      payu_txnid:    params.txnid,
      payu_mihpayid: params.mihpayid ?? null,
      amount_paid:   Number(order.amount),
    },
    { onConflict: 'user_id' }
  )

  if (subErr) {
    console.error('[PayU success] subscription upsert failed:', subErr)
    // Still redirect to success — order is paid, plan will be fixed manually
  }

  // Mark order as success
  await supabase.from('payment_orders')
    .update({
      status:        'success',
      payu_response: params,
      payu_mihpayid: params.mihpayid ?? null,
    })
    .eq('txnid', params.txnid)

  return NextResponse.redirect(
    `${BASE_URL}/payment/success?plan=${order.plan_id}&billing=${order.billing}&txnid=${params.txnid}`,
    303
  )
}
