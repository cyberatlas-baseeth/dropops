'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { Airdrop } from '@/types/database';
import { Button } from '@/components/ui/button';
import { AirdropTable } from '@/components/airdrops/airdrop-table';
import { AirdropFilters } from '@/components/airdrops/airdrop-filters';
import { AddAirdropModal } from '@/components/airdrops/add-airdrop-modal';

export default function DashboardPage() {
    const { address } = useWallet();
    const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchAirdrops = async () => {
        if (!address) {
            setLoading(false);
            return;
        }

        try {
            const supabase = createClient();
            const { data } = await supabase
                .from('airdrops')
                .select('*')
                .eq('wallet_address', address.toLowerCase())
                .order('created_at', { ascending: false });

            setAirdrops((data as Airdrop[]) || []);
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
            if (statusFilter && airdrop.status !== statusFilter) return false;
            return true;
        });
    }, [airdrops, statusFilter]);

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

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
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

            {/* Filters */}
            <div className="mb-6">
                <AirdropFilters
                    status={statusFilter}
                    onStatusChange={setStatusFilter}
                />
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
