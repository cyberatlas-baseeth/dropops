export type AirdropStatus = 'todo' | 'in_progress' | 'completed';

export interface Airdrop {
  id: string;
  wallet_address: string;
  name: string;
  website: string | null;
  funds: string | null;
  estimated_tge: string | null;
  estimated_value: string | null;
  steps_summary: string | null;
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
  total_cost: number;
  claimed_reward: number;
  profit_loss: number;
  roi_percent: number;
}
