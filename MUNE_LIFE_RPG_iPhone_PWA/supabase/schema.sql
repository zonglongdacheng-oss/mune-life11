create extension if not exists "pgcrypto";

create table if not exists profiles (
 id uuid primary key,
 display_name text default '大城宗隆',
 created_at timestamptz default now()
);

create table if not exists stats (
 user_id uuid primary key references profiles(id) on delete cascade,
 body numeric default 56, freedom numeric default 43, challenge numeric default 38,
 expression numeric default 43, connection numeric default 34,
 self_reliance numeric default 48, character numeric default 51,
 life_experience numeric default 31, level int default 1, updated_at timestamptz default now()
);

create table if not exists events (
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 event_date date default current_date, changes jsonb not null default '{}'::jsonb, reason text, created_at timestamptz default now()
);

create table if not exists tasks (
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 text text not null, changes jsonb not null default '{}'::jsonb, xp_text text, done boolean default false,
 due_date date default current_date, created_at timestamptz default now()
);

create table if not exists money (
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 type text check(type in ('income','expense')) not null, amount numeric not null,
 category text not null, memo text, occurred_on date default current_date, created_at timestamptz default now()
);

create table if not exists time_logs (
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 category text not null, minutes int not null, memo text, occurred_on date default current_date, created_at timestamptz default now()
);

create table if not exists body_logs (
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 weight numeric, waist numeric, body_fat numeric, workout text, created_at timestamptz default now()
);

create table if not exists experiences (
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 text text, place text, created_at timestamptz default now()
);

create table if not exists connections (
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 name text, place text, memo text, created_at timestamptz default now()
);

create table if not exists posts (
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 type text, title text, created_at timestamptz default now()
);

create table if not exists journals (
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 joy text, insight text, challenge text, emotion text, created_at timestamptz default now()
);

create table if not exists achievements (
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 code text, unlocked_at timestamptz default now(), unique(user_id,code)
);

create table if not exists ai_daily (
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 analysis text, created_at timestamptz default now()
);

create table if not exists push_subscriptions (
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 endpoint text not null, subscription jsonb not null, created_at timestamptz default now(),
 unique(user_id,endpoint)
);

create table if not exists calendar_connections (
 user_id uuid primary key references profiles(id) on delete cascade,
 provider text not null, access_token text, refresh_token text, expires_at timestamptz
);

create index if not exists money_user_date on money(user_id,occurred_on);
create index if not exists events_user_date on events(user_id,event_date);
create index if not exists time_user_date on time_logs(user_id,occurred_on);

-- Production note: add RLS policies so authenticated users can access only their own rows.
