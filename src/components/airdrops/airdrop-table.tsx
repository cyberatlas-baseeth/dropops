'use client';

import { Airdrop } from '@/types/database';
import Link from 'next/link';

interface AirdropTableProps {
    airdrops: Airdrop[];
}

const statusColors: Record<string, string> = {
    'Tracking': 'bg-blue-500/10 text-blue-600',
    'Active': 'bg-green-500/10 text-green-600',
    'Snapshot Taken': 'bg-yellow-500/10 text-yellow-600',
    'Claimed': 'bg-purple-500/10 text-purple-600',
    'Dropped': 'bg-red-500/10 text-red-600',
};

export function AirdropTable({ airdrops }: AirdropTableProps) {
    if (airdrops.length === 0) {
        return (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
                <div className="text-muted-foreground">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto mb-4 opacity-50"
                    >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <p className="text-lg font-medium">No airdrops yet</p>
                    <p className="text-sm mt-1">Add your first airdrop to start tracking</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Desktop table */}
            <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Name
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Network
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Status
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Created
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {airdrops.map((airdrop) => (
                            <tr key={airdrop.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/airdrop/${airdrop.id}`}
                                        className="font-medium text-foreground hover:underline"
                                    >
                                        {airdrop.name}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {airdrop.network || '—'}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${statusColors[airdrop.status] || 'bg-gray-500/10 text-gray-600'
                                            }`}
                                    >
                                        {airdrop.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {new Date(airdrop.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                {airdrops.map((airdrop) => (
                    <Link
                        key={airdrop.id}
                        href={`/airdrop/${airdrop.id}`}
                        className="block bg-card border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-foreground">{airdrop.name}</h3>
                            <span
                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${statusColors[airdrop.status] || 'bg-gray-500/10 text-gray-600'
                                    }`}
                            >
                                {airdrop.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{airdrop.network || 'No network'}</span>
                            <span>•</span>
                            <span>{new Date(airdrop.created_at).toLocaleDateString()}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
