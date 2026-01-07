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
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS airdrops CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (wallet addresses)
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_users_wallet ON users(wallet_address);

-- Airdrops table (with all fields)
CREATE TABLE airdrops (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text NOT NULL,
  name text NOT NULL,
  network text,
  status text DEFAULT 'Tracking',
  website text,
  funds text,
  estimated_tge text,
  estimated_value text,
  tasks_summary text,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_airdrops_wallet ON airdrops(wallet_address);

-- Tasks table
CREATE TABLE tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  airdrop_id uuid REFERENCES airdrops(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text DEFAULT 'One-time',
  is_completed boolean DEFAULT false,
  last_completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Finance table
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
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE finance DISABLE ROW LEVEL SECURITY;
```

## Airdrop Fields

| Field | Description |
|-------|-------------|
| `name` | Project name (e.g., Base) |
| `network` | Blockchain network |
| `funds` | Funds raised (e.g., $30.00M) |
| `website` | Project website URL |
| `estimated_tge` | Estimated Token Generation Event |
| `estimated_value` | Expected airdrop value range |
| `tasks_summary` | Summary of tasks to complete |
| `notes` | Additional notes |

⚠️ **Warning:** The `DROP TABLE` commands will delete existing data!
