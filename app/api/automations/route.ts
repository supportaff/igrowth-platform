import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/automations?user_id=xxx
export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get('user_id')
  if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('automations')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ automations: data })
}

// POST /api/automations — create
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { user_id, name, trigger, trigger_label, keywords, conditions, actions, status } = body

  if (!user_id || !name || !trigger) {
    return NextResponse.json({ error: 'user_id, name, trigger required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('automations')
    .insert([{ user_id, name, trigger, trigger_label, keywords: keywords ?? [], conditions: conditions ?? [], actions: actions ?? [], status: status ?? 'draft' }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ automation: data })
}
