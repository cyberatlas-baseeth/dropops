'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { Airdrop, Step, AirdropWithSteps } from '@/types/database';
import { Button } from '@/components/ui/button';
import { AirdropCard } from '@/components/airdrops/airdrop-card';
import { AddAirdropModal } from '@/components/airdrops/add-airdrop-modal';

export default function DashboardPage() {
    const { address } = useWallet();
    const [airdrops, setAirdrops] = useState<AirdropWithSteps[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAirdrops = async () => {
        if (!address) {
            setLoading(false);
            return;
        }

        try {
            const supabase = createClient();

            const { data: airdropData } = await supabase
                .from('airdrops')
                .select('*')
                .eq('wallet_address', address.toLowerCase())
                .order('created_at', { ascending: false });

            const { data: stepsData } = await supabase
                .from('steps')
                .select('*');

            const airdropsRaw = (airdropData as Airdrop[]) || [];
            const stepsRaw = (stepsData as Step[]) || [];

            const airdropsWithSteps: AirdropWithSteps[] = airdropsRaw.map(airdrop => {
                const steps = stepsRaw.filter(s => s.airdrop_id === airdrop.id);
                const completedSteps = steps.filter(s => s.is_completed).length;
                const totalSteps = steps.length;
                const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

                return {
                    ...airdrop,
                    steps,
                    completed_steps: completedSteps,
                    total_steps: totalSteps,
                    progress_percent: progressPercent,
                };
            });

            setAirdrops(airdropsWithSteps);
        } catch (error) {
            console.error('Failed to fetch airdrops:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAirdrops();
    }, [address]);

    const todoAirdrops = useMemo(() => airdrops.filter(a => a.progress_percent === 0), [airdrops]);
    const inProgressAirdrops = useMemo(() => airdrops.filter(a => a.progress_percent > 0 && a.progress_percent < 100), [airdrops]);
    const completedAirdrops = useMemo(() => airdrops.filter(a => a.progress_percent === 100), [airdrops]);

    const handleAirdropAdded = () => {
        setIsModalOpen(false);
        fetchAirdrops();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const Column = ({ title, count, airdrops, color }: { title: string; count: number; airdrops: AirdropWithSteps[]; color: string }) => (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <span className={`px-2 py-0.5 text-xs rounded-full ${color}`}>
                    {count}
                </span>
            </div>
            <div className="flex-1 space-y-8 overflow-y-auto">
                {airdrops.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                        No airdrops
                    </div>
                ) : (
                    airdrops.map((airdrop) => (
                        <AirdropCard key={airdrop.id} airdrop={airdrop} onStepToggle={fetchAirdrops} />
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Airdrops</h1>
                    <p className="text-muted-foreground mt-1">
                        Track and manage your airdrop projects
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    + Add Airdrop
                </Button>
            </div>

            {/* 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                <Column
                    title="To-Do"
                    count={todoAirdrops.length}
                    airdrops={todoAirdrops}
                    color="bg-blue-500/20 text-blue-400"
                />
                <Column
                    title="In Progress"
                    count={inProgressAirdrops.length}
                    airdrops={inProgressAirdrops}
                    color="bg-yellow-500/20 text-yellow-400"
                />
                <Column
                    title="Completed"
                    count={completedAirdrops.length}
                    airdrops={completedAirdrops}
                    color="bg-emerald-500/20 text-emerald-400"
                />
            </div>

            {/* Add Modal */}
            <AddAirdropModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleAirdropAdded}
            />
        </div>
    );
}
