/**
 * POST /api/automations/test
 * Simulates a webhook event against a specific automation without
 * touching Instagram — lets you verify keyword matching + action config
 * without needing a real DM from another account.
 *
 * Body: { automationId: string, simulatedMessage: string }
 */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { automationId, simulatedMessage = 'test keyword message' } = await req.json()
  if (!automationId) return NextResponse.json({ error: 'automationId required' }, { status: 400 })

  // Load the automation
  const { data: auto, error: autoErr } = await supabase
    .from('automations')
    .select('*')
    .eq('id', automationId)
    .eq('user_id', userId)
    .single()

  if (autoErr || !auto) {
    return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
  }

  // Check keyword match
  const keywords: string[] = auto.keywords ?? []
  const matched = keywords.length === 0 ||
    keywords.some((kw: string) => simulatedMessage.toLowerCase().includes(kw.toLowerCase()))

  if (!matched) {
    return NextResponse.json({
      matched: false,
      reason: `Message "${simulatedMessage}" did not match keywords: [${keywords.join(', ')}]`,
    })
  }

  // Load connected IG account
  const { data: account } = await supabase
    .from('instagram_accounts')
    .select('ig_user_id, access_token, username')
    .eq('user_id', userId)
    .single()

  if (!account) {
    return NextResponse.json({
      matched: true,
      executed: false,
      reason: 'No Instagram account connected. Connect your IG account first.',
    })
  }

  // Dry-run: list what actions WOULD fire (don't actually call Instagram)
  const wouldExecute = (auto.actions ?? []).map((a: { type: string; message: string; delay?: number }) => ({
    type:    a.type,
    message: a.message,
    delay:   a.delay ?? 0,
    note:    `Would send to recipientId using ig_account ${account.ig_user_id} (@${account.username ?? 'unknown'})`,
  }))

  // Log test run
  await supabase.from('automation_logs').insert({
    automation_id:  auto.id,
    user_id:        userId,
    trigger_type:   auto.trigger + '_test',
    sender_id:      'test_simulation',
    message_text:   simulatedMessage,
    action_type:    'test',
    action_message: JSON.stringify(wouldExecute),
    status:         'success',
  })

  return NextResponse.json({
    matched:       true,
    executed:      false,
    dryRun:        true,
    automation:    { id: auto.id, name: auto.name, trigger: auto.trigger, status: auto.status },
    ig_account:    { username: account.username, ig_user_id: account.ig_user_id },
    wouldExecute,
    message:       'Dry run complete. Actions listed above would fire on a real trigger.',
  })
}
