-- ============================================================
-- Fix automation tables for webhook to work end-to-end
-- ============================================================

-- 1. instagram_accounts — stores the access token per connected IG account
--    This is what the webhook looks up to get the access_token
CREATE TABLE IF NOT EXISTS instagram_accounts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ig_user_id   text NOT NULL UNIQUE,   -- Instagram user ID (string, not number)
  user_id      text NOT NULL,          -- Platform user ID (clerkUserId or igUserId)
  access_token text NOT NULL,          -- Long-lived token (60 days)
  username     text,
  connected_at timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_instagram_accounts_user_id     ON instagram_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_ig_user_id  ON instagram_accounts(ig_user_id);

-- RLS
ALTER TABLE instagram_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all" ON instagram_accounts;
CREATE POLICY "service_role_all" ON instagram_accounts
  FOR ALL USING (auth.role() = 'service_role');


-- 2. automation_logs — fix: add message_id column for proper dedup
--    (previously was checking sender_id for dedup which was wrong)
CREATE TABLE IF NOT EXISTS automation_logs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id  uuid REFERENCES automations(id) ON DELETE CASCADE,
  user_id        text,
  trigger_type   text,
  sender_id      text,
  message_id     text,        -- Instagram message mid — used for dedup
  message_text   text,
  action_type    text,
  action_message text,
  status         text DEFAULT 'success',  -- 'success' | 'failed'
  error_message  text,
  ig_response    text,
  created_at     timestamptz DEFAULT now()
);

-- Add message_id column if table already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'automation_logs' AND column_name = 'message_id'
  ) THEN
    ALTER TABLE automation_logs ADD COLUMN message_id text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_automation_logs_automation_id ON automation_logs(automation_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_message_id    ON automation_logs(message_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_created_at    ON automation_logs(created_at DESC);

ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all" ON automation_logs;
CREATE POLICY "service_role_all" ON automation_logs
  FOR ALL USING (auth.role() = 'service_role');


-- 3. increment_automation_runs RPC — safe upsert of run counter
CREATE OR REPLACE FUNCTION increment_automation_runs(automation_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE automations
  SET
    runs     = COALESCE(runs, 0) + 1,
    last_run = now()
  WHERE id = automation_id;
END;
$$;


-- 4. Ensure automations table has the right columns
--    actions/conditions/keywords should be jsonb not text
DO $$
BEGIN
  -- Convert actions from text to jsonb if needed
  BEGIN
    ALTER TABLE automations ALTER COLUMN actions     TYPE jsonb USING actions::jsonb;
  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN
    ALTER TABLE automations ALTER COLUMN conditions  TYPE jsonb USING conditions::jsonb;
  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN
    ALTER TABLE automations ALTER COLUMN keywords    TYPE jsonb USING keywords::jsonb;
  EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;
