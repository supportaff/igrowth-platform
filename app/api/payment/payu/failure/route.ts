import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const params: Record<string, string> = {}
  formData.forEach((v, k) => { params[k] = String(v) })

  const supabase = createRouteHandlerClient({ cookies })
  await supabase.from('payment_orders').update({
    status: 'failed',
    payu_response: params,
  }).eq('txnid', params.txnid)

  return NextResponse.redirect(`${BASE_URL}/payment/failed?txnid=${params.txnid}&reason=${encodeURIComponent(params.error_Message ?? 'Payment failed')}`)
}
