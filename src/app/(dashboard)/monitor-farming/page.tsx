'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { Airdrop } from '@/types/database';

export default function MonitorFarmingPage() {
    const { address } = useWallet();
    const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editPoints, setEditPoints] = useState('');

    const fetchAirdrops = async () => {
        if (!address) return;

        try {
            const supabase = createClient();
            const { data } = await supabase
                .from('airdrops')
                .select('*')
                .eq('wallet_address', address.toLowerCase())
                .order('name');

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

    const startEdit = (airdrop: Airdrop) => {
        setEditingId(airdrop.id);
        setEditPoints(airdrop.farming_points || '');
    };

    const savePoints = async (id: string) => {
        try {
            const supabase = createClient();
            await supabase.from('airdrops').update({
                farming_points: editPoints || null,
            }).eq('id', id);
            setEditingId(null);
            fetchAirdrops();
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Monitor Farming</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Track your farming points across airdrops
                </p>
            </div>

            {/* Points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {airdrops.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-card border border-border rounded-xl">
                        <p className="text-muted-foreground">No airdrops yet. Add an airdrop from the Dashboard.</p>
                    </div>
                ) : (
                    airdrops.map((airdrop) => {
                        const isEditing = editingId === airdrop.id;

                        return (
                            <div
                                key={airdrop.id}
                                className="bg-card border border-border rounded-xl p-4 hover:border-emerald-500/50 transition-all"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                                            <span className="text-purple-400 font-bold text-sm">
                                                {airdrop.name.substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-foreground">{airdrop.name}</h3>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <p className="text-xs text-muted-foreground mb-1">Farming Points</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editPoints}
                                            onChange={(e) => setEditPoints(e.target.value)}
                                            placeholder="e.g., 1,234,567 XP"
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-purple-400">
                                            {airdrop.farming_points || '-'}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={() => savePoints(airdrop.id)}
                                                className="px-3 py-1.5 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="px-3 py-1.5 text-sm bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => startEdit(airdrop)}
                                            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Edit Points
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}
