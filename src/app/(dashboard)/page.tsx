'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { Airdrop, Step, AirdropWithSteps } from '@/types/database';
import { Button } from '@/components/ui/button';
import { AirdropCard } from '@/components/airdrops/airdrop-card';
import { AddAirdropModal } from '@/components/airdrops/add-airdrop-modal';

// Parse funds string to number for sorting
function parseFunds(funds: string | null): number {
    if (!funds) return 0;
    const match = funds.replace(/[^0-9.]/g, '');
    return parseFloat(match) || 0;
}

// Parse estimated value string to number
function parseEstimatedValue(value: string | null): number {
    if (!value) return 0;
    const match = value.replace(/[^0-9.]/g, '');
    return parseFloat(match) || 0;
}

export default function DashboardPage() {
    const { address } = useWallet();
    const [airdrops, setAirdrops] = useState<AirdropWithSteps[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
                .eq('wallet_address', address.toLowerCase());

            const { data: stepsData } = await supabase
                .from('steps')
                .select('*')
                .order('created_at', { ascending: false });

            const airdropsRaw = (airdropData as Airdrop[]) || [];
            const stepsRaw = (stepsData as Step[]) || [];

            const airdropsWithSteps: AirdropWithSteps[] = airdropsRaw.map(airdrop => {
                const steps = stepsRaw.filter(s => s.airdrop_id === airdrop.id);
                const completedSteps = steps.filter(s => s.is_completed).length;
                const totalSteps = steps.length;
                const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
                const lastUpdated = steps.length > 0 ? steps[0].created_at : null;

                return {
                    ...airdrop,
                    steps,
                    completed_steps: completedSteps,
                    total_steps: totalSteps,
                    progress_percent: progressPercent,
                    last_updated: lastUpdated,
                };
            });

            // Sort by funds (descending)
            airdropsWithSteps.sort((a, b) => parseFunds(b.funds) - parseFunds(a.funds));

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

    // Filter airdrops by search query first
    const filteredAirdrops = useMemo(() => {
        if (!searchQuery.trim()) return airdrops;
        return airdrops.filter(a =>
            a.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [airdrops, searchQuery]);

    // Filter airdrops by status and label
    const todoAirdrops = useMemo(() =>
        filteredAirdrops.filter(a => a.progress_percent === 0 && !['claimed', 'garbage'].includes(a.label ?? '')),
        [filteredAirdrops]);
    const inProgressAirdrops = useMemo(() =>
        filteredAirdrops.filter(a => a.progress_percent > 0 && a.progress_percent < 100 && !['claimed', 'garbage'].includes(a.label ?? '')),
        [filteredAirdrops]);
    const completedAirdrops = useMemo(() =>
        filteredAirdrops.filter(a => a.progress_percent === 100 && !['claimed', 'garbage'].includes(a.label ?? '')),
        [filteredAirdrops]);
    const claimedAirdrops = useMemo(() =>
        filteredAirdrops.filter(a => a.label === 'claimed'),
        [filteredAirdrops]);
    const garbageAirdrops = useMemo(() =>
        filteredAirdrops.filter(a => a.label === 'garbage'),
        [filteredAirdrops]);
    const archivedCount = claimedAirdrops.length + garbageAirdrops.length;

    // Calculate total estimated value (excluding archived)
    const totalEstimatedValue = useMemo(() => {
        return airdrops
            .filter(a => !['claimed', 'garbage'].includes(a.label ?? ''))
            .reduce((sum, a) => sum + parseEstimatedValue(a.estimated_value), 0);
    }, [airdrops]);

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
            <div className="flex-1 space-y-6 overflow-y-auto">
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
                <div className="flex items-center gap-4">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="🔍 Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 w-56 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    {/* Total Estimated Value */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
                        <span className="text-sm text-muted-foreground">Total Est. Value:</span>
                        <span className="text-lg font-bold text-emerald-400">
                            ${totalEstimatedValue.toLocaleString()}
                        </span>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        + Add Airdrop
                    </Button>
                </div>
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
                <div className="flex flex-col h-full">
                    {/* Completed Section */}
                    <Column
                        title="Completed"
                        count={completedAirdrops.length}
                        airdrops={completedAirdrops}
                        color="bg-emerald-500/20 text-emerald-400"
                    />

                    {/* Archived Section */}
                    {archivedCount > 0 && (
                        <div className="mt-6 pt-6 border-t border-border">
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-lg font-semibold text-muted-foreground">Archived</h2>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">
                                    {archivedCount}
                                </span>
                            </div>

                            {/* Claimed Group */}
                            {claimedAirdrops.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-medium text-emerald-400">✅ Claimed</span>
                                        <span className="text-xs text-muted-foreground">({claimedAirdrops.length})</span>
                                    </div>
                                    <div className="space-y-6 opacity-70">
                                        {claimedAirdrops.map((airdrop) => (
                                            <AirdropCard key={airdrop.id} airdrop={airdrop} onStepToggle={fetchAirdrops} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Garbage Group */}
                            {garbageAirdrops.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-medium text-red-400">🗑️ Garbage</span>
                                        <span className="text-xs text-muted-foreground">({garbageAirdrops.length})</span>
                                    </div>
                                    <div className="space-y-6 opacity-50">
                                        {garbageAirdrops.map((airdrop) => (
                                            <AirdropCard key={airdrop.id} airdrop={airdrop} onStepToggle={fetchAirdrops} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
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
