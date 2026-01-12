'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { WaitlistItem, WaitlistType } from '@/types/database';

export default function WaitlistPage() {
    const { address } = useWallet();
    const [items, setItems] = useState<WaitlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({
        project_name: '',
        date: '',
        item_type: 'project' as WaitlistType,
    });
    const [adding, setAdding] = useState(false);

    const fetchItems = async () => {
        if (!address) return;

        try {
            const supabase = createClient();
            const { data } = await supabase
                .from('waitlist')
                .select('*')
                .eq('wallet_address', address.toLowerCase())
                .order('date', { ascending: true });

            setItems((data as WaitlistItem[]) || []);
        } catch (error) {
            console.error('Failed to fetch waitlist:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [address]);

    const addItem = async () => {
        if (!address || !newItem.project_name.trim()) return;
        setAdding(true);

        try {
            const supabase = createClient();
            await supabase.from('waitlist').insert({
                wallet_address: address.toLowerCase(),
                project_name: newItem.project_name.trim(),
                date: newItem.date || null,
                item_type: newItem.item_type,
            });
            setNewItem({ project_name: '', date: '', item_type: 'project' });
            setShowForm(false);
            fetchItems();
        } catch (error) {
            console.error('Failed to add item:', error);
        } finally {
            setAdding(false);
        }
    };

    const updateItemType = async (id: string, newType: WaitlistType) => {
        try {
            const supabase = createClient();
            await supabase.from('waitlist').update({ item_type: newType }).eq('id', id);
            // Update local state immediately for better UX
            setItems(items.map(item =>
                item.id === id ? { ...item, item_type: newType } : item
            ));
        } catch (error) {
            console.error('Failed to update item type:', error);
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const supabase = createClient();
            await supabase.from('waitlist').delete().eq('id', id);
            setItems(items.filter(i => i.id !== id));
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
                    <h1 className="text-2xl font-bold text-foreground">Waitlist</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track NFT mints and project waitlists
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                    + Add to Waitlist
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-card border border-border rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Project Name"
                            value={newItem.project_name}
                            onChange={(e) => setNewItem({ ...newItem, project_name: e.target.value })}
                            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        <input
                            type="date"
                            value={newItem.date}
                            onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        <select
                            value={newItem.item_type}
                            onChange={(e) => setNewItem({ ...newItem, item_type: e.target.value as WaitlistType })}
                            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                            <option value="project">Project</option>
                            <option value="nft">NFT</option>
                        </select>
                        <button
                            onClick={addItem}
                            disabled={adding || !newItem.project_name.trim()}
                            className="px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                        >
                            {adding ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </div>
            )}

            {/* Waitlist Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/50">
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Project</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Date</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No items in your waitlist
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-foreground">{item.project_name}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-muted-foreground">{formatDate(item.date)}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={item.item_type}
                                            onChange={(e) => updateItemType(item.id, e.target.value as WaitlistType)}
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${item.item_type === 'nft'
                                                ? 'bg-pink-500/20 text-pink-400'
                                                : 'bg-purple-500/20 text-purple-400'
                                                }`}
                                        >
                                            <option value="project" className="bg-card text-foreground">Project</option>
                                            <option value="nft" className="bg-card text-foreground">NFT</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
