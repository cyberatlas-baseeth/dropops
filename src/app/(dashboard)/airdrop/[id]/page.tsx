'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AirdropInfo } from '@/components/airdrops/airdrop-info';
import { Airdrop, Step } from '@/types/database';

interface AirdropDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function AirdropDetailPage({ params }: AirdropDetailPageProps) {
    const { id } = use(params);
    const { address } = useWallet();
    const router = useRouter();
    const [airdrop, setAirdrop] = useState<Airdrop | null>(null);
    const [steps, setSteps] = useState<Step[]>([]);
    const [loading, setLoading] = useState(true);
    const [newStep, setNewStep] = useState('');
    const [addingStep, setAddingStep] = useState(false);

    const fetchData = async () => {
        if (!address) return;

        try {
            const supabase = createClient();

            const { data: airdropData } = await supabase
                .from('airdrops')
                .select('*')
                .eq('id', id)
                .eq('wallet_address', address.toLowerCase())
                .single();

            if (!airdropData) {
                router.push('/');
                return;
            }

            setAirdrop(airdropData as Airdrop);

            const { data: stepsData } = await supabase
                .from('steps')
                .select('*')
                .eq('airdrop_id', id)
                .order('created_at', { ascending: true });

            setSteps((stepsData as Step[]) || []);
        } catch (error) {
            console.error('Failed to fetch airdrop:', error);
            router.push('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [address, id]);

    const addStep = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStep.trim()) return;

        setAddingStep(true);
        try {
            const supabase = createClient();
            await supabase.from('steps').insert({
                airdrop_id: id,
                title: newStep.trim(),
                is_completed: false,
            });
            setNewStep('');
            fetchData();
        } catch (error) {
            console.error('Failed to add step:', error);
        } finally {
            setAddingStep(false);
        }
    };

    const toggleStep = async (stepId: string, isCompleted: boolean) => {
        try {
            const supabase = createClient();
            await supabase.from('steps').update({ is_completed: !isCompleted }).eq('id', stepId);
            setSteps(steps.map(s => s.id === stepId ? { ...s, is_completed: !isCompleted } : s));
        } catch (error) {
            console.error('Failed to toggle step:', error);
        }
    };

    const deleteStep = async (stepId: string) => {
        try {
            const supabase = createClient();
            await supabase.from('steps').delete().eq('id', stepId);
            setSteps(steps.filter(s => s.id !== stepId));
        } catch (error) {
            console.error('Failed to delete step:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!airdrop) {
        return null;
    }

    const completedCount = steps.filter(s => s.is_completed).length;
    const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

    return (
        <div className="max-w-3xl">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Dashboard
            </Link>

            <AirdropInfo airdrop={airdrop} onUpdate={fetchData} />

            {/* Steps Section */}
            <div className="mt-6 bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Steps</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            {completedCount}/{steps.length} completed
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${progressPercent === 100
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : progressPercent > 0
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            {progressPercent}%
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-6">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Add Step Form */}
                <form onSubmit={addStep} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Add a new step..."
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <button
                        type="submit"
                        disabled={addingStep || !newStep.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {addingStep ? '...' : 'Add'}
                    </button>
                </form>

                {/* Steps List */}
                {steps.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        <p>No steps yet. Add steps to track your progress!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${step.is_completed
                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                        : 'bg-background border-border hover:border-muted-foreground/30'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleStep(step.id, step.is_completed)}
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${step.is_completed
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : 'border-muted-foreground/50 hover:border-emerald-500'
                                        }`}
                                >
                                    {step.is_completed && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>
                                <span className={`flex-1 text-sm ${step.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {step.title}
                                </span>
                                <button
                                    onClick={() => deleteStep(step.id)}
                                    className="p-1 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
