import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type AutomationStatus = 'active' | 'paused' | 'draft'
export type TriggerType = 'dm_keyword' | 'post_comment' | 'reel_comment' | 'story_reply' | 'new_follower' | 'post_like'
export type ActionType = 'send_dm' | 'send_sequence' | 'tag_lead' | 'reply_comment' | 'add_to_crm'

export interface Condition {
  id: string
  field: 'message' | 'username' | 'follower_count'
  operator: 'contains' | 'equals' | 'starts_with' | 'greater_than'
  value: string
}

export interface ActionStep {
  id: string
  type: ActionType
  delay: number
  message: string
  tag?: string
}

export interface Automation {
  id: string
  user_id: string
  name: string
  trigger: TriggerType
  trigger_label: string
  keywords: string[]
  conditions: Condition[]
  actions: ActionStep[]
  status: AutomationStatus
  runs: number
  last_run: string | null
  success_rate: number
  created_at: string
  updated_at: string
}
