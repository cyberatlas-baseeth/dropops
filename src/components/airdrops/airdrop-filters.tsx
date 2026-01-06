'use client';

import { Select } from '@/components/ui/select';

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Tracking', label: 'Tracking' },
    { value: 'Active', label: 'Active' },
    { value: 'Snapshot Taken', label: 'Snapshot Taken' },
    { value: 'Claimed', label: 'Claimed' },
    { value: 'Dropped', label: 'Dropped' },
];

const networkOptions = [
    { value: '', label: 'All Networks' },
    { value: 'Ethereum', label: 'Ethereum' },
    { value: 'Arbitrum', label: 'Arbitrum' },
    { value: 'Optimism', label: 'Optimism' },
    { value: 'Base', label: 'Base' },
    { value: 'Polygon', label: 'Polygon' },
    { value: 'Solana', label: 'Solana' },
    { value: 'Sui', label: 'Sui' },
    { value: 'Aptos', label: 'Aptos' },
    { value: 'zkSync', label: 'zkSync' },
    { value: 'Starknet', label: 'Starknet' },
    { value: 'Other', label: 'Other' },
];

interface AirdropFiltersProps {
    status: string;
    network: string;
    onStatusChange: (status: string) => void;
    onNetworkChange: (network: string) => void;
}

export function AirdropFilters({
    status,
    network,
    onStatusChange,
    onNetworkChange,
}: AirdropFiltersProps) {
    return (
        <div className="flex gap-3">
            <div className="w-40">
                <Select
                    id="status-filter"
                    options={statusOptions}
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                />
            </div>
            <div className="w-40">
                <Select
                    id="network-filter"
                    options={networkOptions}
                    value={network}
                    onChange={(e) => onNetworkChange(e.target.value)}
                />
            </div>
        </div>
    );
}
