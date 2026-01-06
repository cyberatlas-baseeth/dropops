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
    const [networkFilter, setNetworkFilter] = useState('');

    const fetchAirdrops = async () => {
        if (!address) return;

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
            if (networkFilter && airdrop.network !== networkFilter) return false;
            return true;
        });
    }, [airdrops, statusFilter, networkFilter]);

    const handleAirdropAdded = () => {
        setIsModalOpen(false);
        fetchAirdrops();
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
                    <h1 className="text-2xl font-bold text-foreground">Airdrops</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track and manage your airdrop projects
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
                    Add Airdrop
                </Button>
            </div>

            <div className="mb-4">
                <AirdropFilters
                    status={statusFilter}
                    network={networkFilter}
                    onStatusChange={setStatusFilter}
                    onNetworkChange={setNetworkFilter}
                />
            </div>

            <AirdropTable airdrops={filteredAirdrops} />

            <AddAirdropModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleAirdropAdded}
            />
        </>
    );
}
