'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { Airdrop, Step, AirdropWithSteps } from '@/types/database';
import { Button } from '@/components/ui/button';
import { AirdropTable } from '@/components/airdrops/airdrop-table';
import { AddAirdropModal } from '@/components/airdrops/add-airdrop-modal';

type TabType = 'todo' | 'in_progress' | 'completed';

const tabs: { id: TabType; label: string }[] = [
    { id: 'todo', label: 'To-Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
];

export default function DashboardPage() {
    const { address } = useWallet();
    const [airdrops, setAirdrops] = useState<AirdropWithSteps[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('todo');

    const fetchAirdrops = async () => {
        if (!address) {
            setLoading(false);
            return;
        }

        try {
            const supabase = createClient();

            // Fetch airdrops
            const { data: airdropData } = await supabase
                .from('airdrops')
                .select('*')
                .eq('wallet_address', address.toLowerCase())
                .order('created_at', { ascending: false });

            // Fetch steps for all airdrops
            const { data: stepsData } = await supabase
                .from('steps')
                .select('*');

            const airdropsRaw = (airdropData as Airdrop[]) || [];
            const stepsRaw = (stepsData as Step[]) || [];

            // Combine airdrops with their steps
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

    const filteredAirdrops = useMemo(() => {
        return airdrops.filter((airdrop) => {
            const percent = airdrop.progress_percent;
            if (activeTab === 'todo') return percent === 0;
            if (activeTab === 'in_progress') return percent > 0 && percent < 100;
            if (activeTab === 'completed') return percent === 100;
            return true;
        });
    }, [airdrops, activeTab]);

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

    // Count airdrops in each category
    const todoCount = airdrops.filter(a => a.progress_percent === 0).length;
    const inProgressCount = airdrops.filter(a => a.progress_percent > 0 && a.progress_percent < 100).length;
    const completedCount = airdrops.filter(a => a.progress_percent === 100).length;

    const getCounts = (tab: TabType) => {
        if (tab === 'todo') return todoCount;
        if (tab === 'in_progress') return inProgressCount;
        if (tab === 'completed') return completedCount;
        return 0;
    };

    return (
        <div>
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

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-emerald-500 text-emerald-500'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                        <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-muted">
                            {getCounts(tab.id)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Airdrop Grid */}
            <AirdropTable airdrops={filteredAirdrops} />

            {/* Add Modal */}
            <AddAirdropModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleAirdropAdded}
            />
        </div>
    );
}
