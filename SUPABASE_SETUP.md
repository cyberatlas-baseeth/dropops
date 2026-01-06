# Supabase Configuration

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Setup

Run these SQL commands in your Supabase SQL Editor:

### Airdrops Table
```sql
create table if not exists airdrops (
  id uuid default gen_random_uuid() primary key,
  wallet_address text not null,
  name text not null,
  network text,
  status text default 'Tracking',
  notes text,
  created_at timestamp with time zone default now()
);

create index if not exists idx_airdrops_wallet on airdrops(wallet_address);
```

### Tasks Table
```sql
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  airdrop_id uuid references airdrops(id) on delete cascade,
  title text not null,
  type text default 'One-time',
  is_completed boolean default false,
  last_completed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);
```

### Finance Table
```sql
create table if not exists finance (
  id uuid default gen_random_uuid() primary key,
  airdrop_id uuid references airdrops(id) on delete cascade,
  cost_type text not null,
  amount decimal(18,6) default 0,
  created_at timestamp with time zone default now()
);
```

### Disable RLS (for simplicity with wallet auth)
```sql
alter table airdrops disable row level security;
alter table tasks disable row level security;
alter table finance disable row level security;
```

## Note

This app uses MetaMask wallet authentication instead of Supabase Auth. 
Data is filtered by `wallet_address` in the application layer.
