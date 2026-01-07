'use client';

import { Airdrop } from '@/types/database';
import Link from 'next/link';

interface AirdropTableProps {
    airdrops: Airdrop[];
}

const statusColors: Record<string, { bg: string; text: string }> = {
    'Tracking': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    'Active': { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    'Snapshot Taken': { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    'Claimed': { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    'Dropped': { bg: 'bg-red-500/20', text: 'text-red-400' },
};

export function AirdropTable({ airdrops }: AirdropTableProps) {
    if (airdrops.length === 0) {
        return (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
                <div className="text-muted-foreground">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="56"
                        height="56"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto mb-4 opacity-40"
                    >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <p className="text-lg font-medium">No airdrops yet</p>
                    <p className="text-sm mt-1 opacity-70">Add your first airdrop to start tracking</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {airdrops.map((airdrop) => {
                const statusStyle = statusColors[airdrop.status] || { bg: 'bg-gray-500/20', text: 'text-gray-400' };

                return (
                    <Link
                        key={airdrop.id}
                        href={`/airdrop/${airdrop.id}`}
                        className="block bg-card border border-border rounded-xl p-5 hover:border-emerald-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                                    <span className="text-emerald-400 font-bold text-sm">
                                        {airdrop.name.substring(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        {airdrop.name}
                                    </h3>
                                    {airdrop.network && (
                                        <p className="text-xs text-muted-foreground">{airdrop.network}</p>
                                    )}
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                {airdrop.status}
                            </span>
                        </div>

                        {/* Info Grid */}
                        <div className="space-y-2 text-sm">
                            {airdrop.funds && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Funds:</span>
                                    <span className="text-foreground font-medium">{airdrop.funds}</span>
                                </div>
                            )}
                            {airdrop.estimated_tge && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Est. TGE:</span>
                                    <span className="text-foreground">{airdrop.estimated_tge}</span>
                                </div>
                            )}
                            {airdrop.estimated_value && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Est. Value:</span>
                                    <span className="text-emerald-400 font-medium">{airdrop.estimated_value}</span>
                                </div>
                            )}
                        </div>

                        {/* Tasks Summary */}
                        {airdrop.tasks_summary && (
                            <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-xs text-muted-foreground mb-1">Tasks:</p>
                                <p className="text-sm text-foreground line-clamp-2">{airdrop.tasks_summary}</p>
                            </div>
                        )}

                        {/* Website */}
                        {airdrop.website && (
                            <div className="mt-3">
                                <span className="text-xs text-muted-foreground truncate block">{airdrop.website}</span>
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
