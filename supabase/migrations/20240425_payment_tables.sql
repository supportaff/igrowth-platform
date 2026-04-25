-- Payment orders table (tracks every PayU transaction attempt)
create table if not exists payment_orders (
  id              uuid primary key default gen_random_uuid(),
  txnid           text unique not null,
  user_id         uuid references auth.users(id) on delete cascade,
  plan_id         text not null,                        -- 'pro' | 'growth'
  billing         text not null,                        -- 'monthly' | 'annual'
  amount          numeric(10,2) not null,
  plan_name       text,
  status          text default 'pending',               -- pending | success | failed
  environment     text default 'test',                  -- test | live
  payu_mihpayid   text,
  payu_response   jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Subscriptions table (one active row per user)
create table if not exists subscriptions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid unique references auth.users(id) on delete cascade,
  plan_id         text not null default 'free',         -- 'free' | 'pro' | 'growth'
  billing         text,                                 -- 'monthly' | 'annual' | null for free
  status          text not null default 'active',       -- active | cancelled | expired
  started_at      timestamptz default now(),
  expires_at      timestamptz,
  payu_txnid      text,
  payu_mihpayid   text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- RLS
alter table payment_orders  enable row level security;
alter table subscriptions   enable row level security;

create policy "Users can view own orders"        on payment_orders  for select using (auth.uid() = user_id);
create policy "Service role manages orders"      on payment_orders  for all    using (auth.role() = 'service_role');
create policy "Users can view own subscription"  on subscriptions   for select using (auth.uid() = user_id);
create policy "Service role manages subs"        on subscriptions   for all    using (auth.role() = 'service_role');
