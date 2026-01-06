'use client';

import { AirdropWithFinance } from '@/types/database';
import Link from 'next/link';

interface FinanceTableProps {
    data: AirdropWithFinance[];
}

export function FinanceTable({ data }: FinanceTableProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(value);
    };

    const formatPercent = (value: number) => {
        if (!isFinite(value)) return '—';
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    if (data.length === 0) {
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
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <p className="text-lg font-medium">No finance data yet</p>
                    <p className="text-sm mt-1">Add costs or rewards to see your P/L</p>
                </div>
            </div>
        );
    }

    const totals = data.reduce(
        (acc, row) => ({
            total_cost: acc.total_cost + row.total_cost,
            claimed_reward: acc.claimed_reward + row.claimed_reward,
            profit_loss: acc.profit_loss + row.profit_loss,
        }),
        { total_cost: 0, claimed_reward: 0, profit_loss: 0 }
    );

    const totalROI = totals.total_cost > 0
        ? (totals.profit_loss / totals.total_cost) * 100
        : 0;

    return (
        <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Cost</p>
                    <p className="text-xl font-semibold text-foreground">{formatCurrency(totals.total_cost)}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Claimed</p>
                    <p className="text-xl font-semibold text-foreground">{formatCurrency(totals.claimed_reward)}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Profit / Loss</p>
                    <p className={`text-xl font-semibold ${totals.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(totals.profit_loss)}
                    </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">ROI</p>
                    <p className={`text-xl font-semibold ${totalROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercent(totalROI)}
                    </p>
                </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Airdrop
                            </th>
                            <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Total Cost
                            </th>
                            <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Claimed
                            </th>
                            <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                P/L
                            </th>
                            <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                ROI
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/airdrop/${row.id}`}
                                        className="font-medium text-foreground hover:underline"
                                    >
                                        {row.name}
                                    </Link>
                                    <span className="text-muted-foreground text-sm ml-2">
                                        {row.network || ''}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-foreground">
                                    {formatCurrency(row.total_cost)}
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-foreground">
                                    {formatCurrency(row.claimed_reward)}
                                </td>
                                <td
                                    className={`px-4 py-3 text-right text-sm font-medium ${row.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {formatCurrency(row.profit_loss)}
                                </td>
                                <td
                                    className={`px-4 py-3 text-right text-sm font-medium ${row.roi_percent >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {formatPercent(row.roi_percent)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                {data.map((row) => (
                    <Link
                        key={row.id}
                        href={`/airdrop/${row.id}`}
                        className="block bg-card border border-border rounded-lg p-4"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-medium text-foreground">{row.name}</h3>
                                <p className="text-sm text-muted-foreground">{row.network || 'No network'}</p>
                            </div>
                            <span
                                className={`text-lg font-semibold ${row.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {formatCurrency(row.profit_loss)}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                                <p className="text-muted-foreground">Cost</p>
                                <p className="font-medium text-foreground">{formatCurrency(row.total_cost)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Claimed</p>
                                <p className="font-medium text-foreground">{formatCurrency(row.claimed_reward)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">ROI</p>
                                <p className={`font-medium ${row.roi_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatPercent(row.roi_percent)}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
