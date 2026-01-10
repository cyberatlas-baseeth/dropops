'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { Airdrop } from '@/types/database';

export default function FinancePage() {
    const { address } = useWallet();
    const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<{
        total_cost: number;
        claimed_reward: number;
        start_date: string;
        end_date: string;
    }>({ total_cost: 0, claimed_reward: 0, start_date: '', end_date: '' });

    const fetchData = async () => {
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
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [address]);

    const startEdit = (airdrop: Airdrop) => {
        setEditingId(airdrop.id);
        setEditData({
            total_cost: airdrop.total_cost || 0,
            claimed_reward: airdrop.claimed_reward || 0,
            start_date: airdrop.start_date || '',
            end_date: airdrop.end_date || '',
        });
    };

    const saveEdit = async (id: string) => {
        try {
            const supabase = createClient();
            await supabase.from('airdrops').update({
                total_cost: editData.total_cost,
                claimed_reward: editData.claimed_reward,
                start_date: editData.start_date || null,
                end_date: editData.end_date || null,
            }).eq('id', id);
            setEditingId(null);
            fetchData();
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

    // Calculate totals
    const totalCost = airdrops.reduce((sum, a) => sum + (a.total_cost || 0), 0);
    const totalReward = airdrops.reduce((sum, a) => sum + (a.claimed_reward || 0), 0);
    const totalPL = totalReward - totalCost;

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Finance</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track costs and returns across your airdrops
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-2xl font-bold text-red-400">${totalCost.toFixed(2)}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total Claimed</p>
                    <p className="text-2xl font-bold text-emerald-400">${totalReward.toFixed(2)}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Profit / Loss</p>
                    <p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Airdrop Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/50">
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Airdrop</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Start Date</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">End Date</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Total Cost</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Claimed</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">P/L</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {airdrops.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No airdrops yet. Add an airdrop from the Dashboard.
                                </td>
                            </tr>
                        ) : (
                            airdrops.map((airdrop) => {
                                const isEditing = editingId === airdrop.id;
                                const pl = (airdrop.claimed_reward || 0) - (airdrop.total_cost || 0);

                                return (
                                    <tr key={airdrop.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-foreground">{airdrop.name}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    value={editData.start_date}
                                                    onChange={(e) => setEditData({ ...editData, start_date: e.target.value })}
                                                    className="px-2 py-1 bg-background border border-border rounded text-sm w-32"
                                                />
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    {airdrop.start_date || '-'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    value={editData.end_date}
                                                    onChange={(e) => setEditData({ ...editData, end_date: e.target.value })}
                                                    className="px-2 py-1 bg-background border border-border rounded text-sm w-32"
                                                />
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    {airdrop.end_date || '-'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editData.total_cost}
                                                    onChange={(e) => setEditData({ ...editData, total_cost: parseFloat(e.target.value) || 0 })}
                                                    className="px-2 py-1 bg-background border border-border rounded text-sm w-24 text-right"
                                                />
                                            ) : (
                                                <span className="text-red-400">${(airdrop.total_cost || 0).toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editData.claimed_reward}
                                                    onChange={(e) => setEditData({ ...editData, claimed_reward: parseFloat(e.target.value) || 0 })}
                                                    className="px-2 py-1 bg-background border border-border rounded text-sm w-24 text-right"
                                                />
                                            ) : (
                                                <span className="text-emerald-400">${(airdrop.claimed_reward || 0).toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={pl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                                {pl >= 0 ? '+' : ''}${pl.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {isEditing ? (
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => saveEdit(airdrop.id)}
                                                        className="px-2 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="px-2 py-1 text-xs bg-muted text-foreground rounded hover:bg-muted/80"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => startEdit(airdrop)}
                                                    className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
