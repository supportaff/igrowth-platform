import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const [dmsRes, contactsRes, automationsRes] = await Promise.all([
      supabase
        .from('dm_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', monthStart.toISOString()),

      supabase
        .from('contacts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),

      // FIX: was .eq('is_active', true) — the column is 'status'
      supabase
        .from('automations')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'active'),
    ])

    return NextResponse.json({
      dms:         dmsRes.count         ?? 0,
      contacts:    contactsRes.count    ?? 0,
      automations: automationsRes.count ?? 0,
    })
  } catch (err) {
    console.error('[usage] error:', err)
    return NextResponse.json({ dms: 0, contacts: 0, automations: 0 })
  }
}
