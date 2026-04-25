import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

function makeSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get:    (name) => cookieStore.get(name)?.value,
        set:    () => {},
        remove: () => {},
      },
    }
  )
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const params: Record<string, string> = {}
  formData.forEach((v, k) => { params[k] = String(v) })

  const supabase = makeSupabase()
  await supabase.from('payment_orders').update({
    status: 'failed',
    payu_response: params,
    failure_reason: params.error_Message ?? null,
  }).eq('txnid', params.txnid)

  return NextResponse.redirect(
    `${BASE_URL}/payment/failed?txnid=${params.txnid}&reason=${encodeURIComponent(params.error_Message ?? 'Payment failed')}`
  )
}
