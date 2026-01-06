# Supabase Configuration

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Setup

Run these SQL commands in your Supabase SQL Editor:

### Enable UUID Extension
```sql
create extension if not exists "uuid-ossp";
```

### Airdrops Table
```sql
create table airdrops (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  network text,
  status text default 'Tracking',
  notes text,
  created_at timestamp with time zone default now()
);

alter table airdrops enable row level security;

create policy "Users can view own airdrops" on airdrops
  for select using (auth.uid() = user_id);

create policy "Users can insert own airdrops" on airdrops
  for insert with check (auth.uid() = user_id);

create policy "Users can update own airdrops" on airdrops
  for update using (auth.uid() = user_id);

create policy "Users can delete own airdrops" on airdrops
  for delete using (auth.uid() = user_id);
```

### Tasks Table
```sql
create table tasks (
  id uuid default gen_random_uuid() primary key,
  airdrop_id uuid references airdrops(id) on delete cascade,
  title text not null,
  type text default 'One-time',
  is_completed boolean default false,
  last_completed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table tasks enable row level security;

create policy "Users can manage own airdrop tasks" on tasks
  for all using (
    airdrop_id in (select id from airdrops where user_id = auth.uid())
  );
```

### Finance Table
```sql
create table finance (
  id uuid default gen_random_uuid() primary key,
  airdrop_id uuid references airdrops(id) on delete cascade,
  cost_type text not null,
  amount decimal(18,6) default 0,
  created_at timestamp with time zone default now()
);

alter table finance enable row level security;

create policy "Users can manage own airdrop finance" on finance
  for all using (
    airdrop_id in (select id from airdrops where user_id = auth.uid())
  );
```
