# Supabase Configuration

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Drop existing tables (if any)
DROP TABLE IF EXISTS finance CASCADE;
DROP TABLE IF EXISTS steps CASCADE;
DROP TABLE IF EXISTS daily_tasks CASCADE;
DROP TABLE IF EXISTS airdrops CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (wallet addresses)
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_users_wallet ON users(wallet_address);

-- Airdrops table
CREATE TABLE airdrops (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text NOT NULL,
  name text NOT NULL,
  website text,
  funds text,
  estimated_tge text,
  estimated_value text,
  start_date date,
  end_date date,
  total_cost decimal(18,2) DEFAULT 0,
  claimed_reward decimal(18,2) DEFAULT 0,
  farming_points text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_airdrops_wallet ON airdrops(wallet_address);

-- Steps table (airdrop-specific steps with checkboxes)
CREATE TABLE steps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  airdrop_id uuid REFERENCES airdrops(id) ON DELETE CASCADE,
  title text NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_steps_airdrop ON steps(airdrop_id);

-- Daily Tasks table (global daily tasks and to-do list)
CREATE TABLE daily_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text NOT NULL,
  title text NOT NULL,
  is_completed boolean DEFAULT false,
  task_type text DEFAULT 'daily',
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_daily_tasks_wallet ON daily_tasks(wallet_address);

-- Finance table (optional, for detailed tracking)
CREATE TABLE finance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  airdrop_id uuid REFERENCES airdrops(id) ON DELETE CASCADE,
  cost_type text NOT NULL,
  amount decimal(18,6) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Disable RLS (wallet filtering is done at app level)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE airdrops DISABLE ROW LEVEL SECURITY;
ALTER TABLE steps DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE finance DISABLE ROW LEVEL SECURITY;
```

## Add columns to existing table (if upgrading)

```sql
ALTER TABLE airdrops ADD COLUMN IF NOT EXISTS start_date date;
ALTER TABLE airdrops ADD COLUMN IF NOT EXISTS end_date date;
ALTER TABLE airdrops ADD COLUMN IF NOT EXISTS total_cost decimal(18,2) DEFAULT 0;
ALTER TABLE airdrops ADD COLUMN IF NOT EXISTS claimed_reward decimal(18,2) DEFAULT 0;
ALTER TABLE airdrops ADD COLUMN IF NOT EXISTS farming_points text;

-- Waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text NOT NULL,
  project_name text NOT NULL,
  date date,
  item_type text DEFAULT 'project',
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_wallet ON waitlist(wallet_address);
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning:** The `DROP TABLE` commands will delete existing data!
