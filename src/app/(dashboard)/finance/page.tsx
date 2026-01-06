import { createClient } from '@/lib/supabase/server';
import { FinanceClient } from '@/components/finance/finance-client';
import { Airdrop, Finance, AirdropWithFinance } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
    try {
        const supabase = await createClient();

        const { data: airdrops } = await supabase
            .from('airdrops')
            .select('*')
            .order('name');

        const { data: finance } = await supabase.from('finance').select('*');

        // Calculate per-airdrop finance data
        const financeMap = new Map<string, { costs: number; rewards: number }>();

        (finance as Finance[] || []).forEach((entry) => {
            const existing = financeMap.get(entry.airdrop_id) || { costs: 0, rewards: 0 };
            if (entry.cost_type === 'Claimed Reward') {
                existing.rewards += Number(entry.amount);
            } else {
                existing.costs += Number(entry.amount);
            }
            financeMap.set(entry.airdrop_id, existing);
        });

        const dataWithFinance: AirdropWithFinance[] = ((airdrops as Airdrop[]) || [])
            .map((airdrop) => {
                const financeData = financeMap.get(airdrop.id) || { costs: 0, rewards: 0 };
                const total_cost = financeData.costs;
                const claimed_reward = financeData.rewards;
                const profit_loss = claimed_reward - total_cost;
                const roi_percent = total_cost > 0 ? (profit_loss / total_cost) * 100 : 0;

                return {
                    ...airdrop,
                    total_cost,
                    claimed_reward,
                    profit_loss,
                    roi_percent,
                };
            })
            .filter((a) => a.total_cost > 0 || a.claimed_reward > 0);

        return (
            <FinanceClient
                data={dataWithFinance}
                airdrops={(airdrops as Airdrop[]) || []}
            />
        );
    } catch {
        return <FinanceClient data={[]} airdrops={[]} />;
    }
}
