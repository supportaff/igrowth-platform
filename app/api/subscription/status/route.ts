import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ plan: 'free', status: 'unauthenticated' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('plan_id, billing, status, expires_at, amount_paid, started_at')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return NextResponse.json({ plan: 'free', status: 'inactive' })
  }

  const isActive =
    data.status === 'active' &&
    (data.expires_at === null || new Date(data.expires_at) > new Date())

  return NextResponse.json({
    plan:       isActive ? data.plan_id : 'free',
    status:     data.status,
    billing:    data.billing,
    expiresAt:  data.expires_at,
    amountPaid: data.amount_paid,
    startedAt:  data.started_at,
    isActive,
  })
}
