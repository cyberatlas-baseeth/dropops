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

const networkColors: Record<string, string> = {
    'Ethereum': 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    'Arbitrum': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    'Optimism': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Base': 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    'Polygon': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Solana': 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border-purple-400/30',
    'Sui': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Aptos': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    'zkSync': 'bg-purple-600/20 text-purple-400 border-purple-500/30',
    'Starknet': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Other': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
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
                const networkStyle = networkColors[airdrop.network || 'Other'] || networkColors['Other'];

                return (
                    <div
                        key={airdrop.id}
                        className="bg-card border border-border rounded-xl p-5 hover:border-emerald-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5 group"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {/* Project Icon */}
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                                    <span className="text-emerald-400 font-bold text-sm">
                                        {airdrop.name.substring(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                                        {airdrop.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(airdrop.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                {airdrop.status}
                            </span>
                        </div>

                        {/* Network Badge */}
                        {airdrop.network && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${networkStyle}`}>
                                    {airdrop.network}
                                </span>
                            </div>
                        )}

                        {/* Notes Preview */}
                        {airdrop.notes && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {airdrop.notes}
                            </p>
                        )}

                        {/* Divider */}
                        <div className="border-t border-border my-4" />

                        {/* Action Button */}
                        <Link
                            href={`/airdrop/${airdrop.id}`}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-medium text-sm hover:from-emerald-500 hover:to-cyan-500 transition-all duration-200"
                        >
                            View Details
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
                            >
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                            </svg>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
