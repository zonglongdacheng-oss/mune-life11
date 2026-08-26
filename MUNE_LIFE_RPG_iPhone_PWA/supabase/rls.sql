-- Run after auth is wired to profiles.id = auth.uid().
alter table profiles enable row level security;
alter table stats enable row level security;
alter table events enable row level security;
alter table tasks enable row level security;
alter table money enable row level security;
alter table time_logs enable row level security;
alter table body_logs enable row level security;
alter table experiences enable row level security;
alter table connections enable row level security;
alter table posts enable row level security;
alter table journals enable row level security;
alter table achievements enable row level security;
alter table ai_daily enable row level security;
alter table push_subscriptions enable row level security;

-- Example policy pattern:
-- create policy "own rows" on money for all using (user_id = auth.uid()) with check (user_id = auth.uid());
-- Repeat for every user-owned table.
