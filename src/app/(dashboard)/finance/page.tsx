'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { Airdrop, Finance, AirdropWithFinance } from '@/types/database';
import { Button } from '@/components/ui/button';
import { FinanceTable } from '@/components/finance/finance-table';
import { AddCostModal } from '@/components/finance/add-cost-modal';

export default function FinancePage() {
    const { address } = useWallet();
    const [data, setData] = useState<AirdropWithFinance[]>([]);
    const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        if (!address) return;

        try {
            const supabase = createClient();

            const { data: airdropData } = await supabase
                .from('airdrops')
                .select('*')
                .eq('wallet_address', address.toLowerCase())
                .order('name');

            const { data: financeData } = await supabase.from('finance').select('*');

            const allAirdrops = (airdropData as Airdrop[]) || [];
            setAirdrops(allAirdrops);

            // Calculate per-airdrop finance data
            const financeMap = new Map<string, { costs: number; rewards: number }>();

            ((financeData as Finance[]) || []).forEach((entry) => {
                const existing = financeMap.get(entry.airdrop_id) || { costs: 0, rewards: 0 };
                if (entry.cost_type === 'Reward') {
                    existing.rewards += Number(entry.amount);
                } else {
                    existing.costs += Number(entry.amount);
                }
                financeMap.set(entry.airdrop_id, existing);
            });

            const dataWithFinance: AirdropWithFinance[] = allAirdrops
                .map((airdrop) => {
                    const financeInfo = financeMap.get(airdrop.id) || { costs: 0, rewards: 0 };
                    const total_cost = financeInfo.costs;
                    const claimed_reward = financeInfo.rewards;
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

            setData(dataWithFinance);
        } catch (error) {
            console.error('Failed to fetch finance data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [address]);

    const handleSuccess = () => {
        setIsModalOpen(false);
        fetchData();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Finance</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track costs and returns across your airdrops
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Entry
                </Button>
            </div>

            <FinanceTable data={data} />

            <AddCostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                airdrops={airdrops}
                onSuccess={handleSuccess}
            />
        </>
    );
}
