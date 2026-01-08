export type AirdropStatus = 'todo' | 'in_progress' | 'completed';

export type CostType = 'Cost' | 'Reward';

export type TaskType = 'Daily' | 'Weekly' | 'One-time';

export interface Airdrop {
  id: string;
  wallet_address: string;
  name: string;
  website: string | null;
  funds: string | null;
  estimated_tge: string | null;
  estimated_value: string | null;
  start_date: string | null;
  end_date: string | null;
  total_cost: number;
  claimed_reward: number;
  farming_points: string | null;
  created_at: string;
}

export interface Step {
  id: string;
  airdrop_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
}

export interface AirdropWithSteps extends Airdrop {
  steps: Step[];
  completed_steps: number;
  total_steps: number;
  progress_percent: number;
  last_updated: string | null;
}

export interface DailyTask {
  id: string;
  wallet_address: string;
  title: string;
  is_completed: boolean;
  task_type: 'daily' | 'todo';
  created_at: string;
}

export interface Finance {
  id: string;
  airdrop_id: string;
  cost_type: string;
  amount: number;
  created_at: string;
}

export interface AirdropWithFinance extends Airdrop {
  profit_loss: number;
  roi_percent: number;
}
