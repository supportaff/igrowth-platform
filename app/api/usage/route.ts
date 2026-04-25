import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { PLANS, type PlanId } from '@/lib/plans'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch user subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan_id, status, expires_at, billing')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .single()

    const planId: PlanId = (sub?.plan_id as PlanId) ?? 'free'
    const limits = PLANS[planId]

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const [dmsRes, contactsRes, automationsRes, dealsRes] = await Promise.all([
      supabase
        .from('dm_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', monthStart.toISOString()),

      supabase
        .from('contacts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),

      supabase
        .from('automations')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'active'),

      supabase
        .from('brand_deals')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .neq('stage', 'completed'),
    ])

    return NextResponse.json({
      plan:    planId,
      billing: sub?.billing ?? null,
      expires: sub?.expires_at ?? null,
      limits: {
        dms:         limits.dmsPerMonth,
        contacts:    limits.contacts,
        automations: limits.automations,
        brandDeals:  limits.brandDeals,
      },
      usage: {
        dms:         dmsRes.count         ?? 0,
        contacts:    contactsRes.count    ?? 0,
        automations: automationsRes.count ?? 0,
        brandDeals:  dealsRes.count       ?? 0,
      },
    })
  } catch (err) {
    console.error('[usage] error:', err)
    return NextResponse.json({ plan: 'free', limits: PLANS.free, usage: { dms: 0, contacts: 0, automations: 0, brandDeals: 0 } })
  }
}
