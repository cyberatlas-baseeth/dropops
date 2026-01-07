export type AirdropStatus = 'Tracking' | 'Active' | 'Snapshot Taken' | 'Claimed' | 'Dropped';

export type TaskType = 'Daily' | 'Weekly' | 'One-time';

export type CostType = 'Gas Fee' | 'Other' | 'Claimed Reward';

export interface Airdrop {
  id: string;
  wallet_address: string;
  name: string;
  network: string | null;
  status: AirdropStatus;
  notes: string | null;
  website: string | null;
  funds: string | null;
  estimated_tge: string | null;
  estimated_value: string | null;
  tasks_summary: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  airdrop_id: string;
  title: string;
  type: TaskType;
  is_completed: boolean;
  last_completed_at: string | null;
  created_at: string;
}

export interface Finance {
  id: string;
  airdrop_id: string;
  cost_type: CostType;
  amount: number;
  created_at: string;
}

export interface AirdropWithFinance extends Airdrop {
  total_cost: number;
  claimed_reward: number;
  profit_loss: number;
  roi_percent: number;
}
