'use client';

import { createClient } from '@/lib/supabase/client';
import { AirdropWithSteps } from '@/types/database';
import Link from 'next/link';

interface AirdropCardProps {
    airdrop: AirdropWithSteps;
    onStepToggle?: () => void;
}

export function AirdropCard({ airdrop, onStepToggle }: AirdropCardProps) {
    const toggleStep = async (e: React.MouseEvent, stepId: string, isCompleted: boolean) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const supabase = createClient();
            await supabase.from('steps').update({ is_completed: !isCompleted }).eq('id', stepId);
            onStepToggle?.();
        } catch (error) {
            console.error('Failed to toggle step:', error);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl p-4 hover:border-emerald-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5">
            {/* Header */}
            <Link href={`/airdrop/${airdrop.id}`} className="block">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                            <span className="text-emerald-400 font-bold text-xs">
                                {airdrop.name.substring(0, 2).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground text-sm hover:text-emerald-500 transition-colors">
                                {airdrop.name}
                            </h3>
                            {airdrop.total_steps > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    {airdrop.completed_steps}/{airdrop.total_steps} steps
                                </p>
                            )}
                        </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${airdrop.progress_percent === 100
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : airdrop.progress_percent > 0
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-blue-500/20 text-blue-400'
                        }`}>
                        {airdrop.progress_percent}%
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                        style={{ width: `${airdrop.progress_percent}%` }}
                    />
                </div>
            </Link>

            {/* Info */}
            {(airdrop.funds || airdrop.estimated_value) && (
                <div className="space-y-1 text-xs mb-3">
                    {airdrop.funds && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Funds:</span>
                            <span className="text-foreground font-medium">{airdrop.funds}</span>
                        </div>
                    )}
                    {airdrop.estimated_value && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Est. Value:</span>
                            <span className="text-emerald-400 font-medium">{airdrop.estimated_value}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Steps */}
            {airdrop.total_steps > 0 && (
                <div className="border-t border-border pt-3 space-y-1.5">
                    {airdrop.steps.map((step) => (
                        <div
                            key={step.id}
                            className={`flex items-center gap-2 p-1.5 rounded-md border transition-colors ${step.is_completed
                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                    : 'bg-background border-border'
                                }`}
                        >
                            <button
                                onClick={(e) => toggleStep(e, step.id, step.is_completed)}
                                className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${step.is_completed
                                        ? 'bg-emerald-500 border-emerald-500'
                                        : 'border-muted-foreground/50 hover:border-emerald-500'
                                    }`}
                            >
                                {step.is_completed && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </button>
                            <span className={`text-xs ${step.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
