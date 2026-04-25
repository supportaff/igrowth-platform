import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const params: Record<string, string> = {}
  formData.forEach((v, k) => { params[k] = String(v) })

  await supabase.from('payment_orders').update({
    status:         'failed',
    payu_response:  params,
    failure_reason: params.error_Message ?? params.field9 ?? 'Payment declined',
  }).eq('txnid', params.txnid)

  return NextResponse.redirect(
    `${BASE_URL}/payment/failed?txnid=${params.txnid}&reason=${encodeURIComponent(params.error_Message ?? 'Payment was not completed')}`,
    303
  )
}
