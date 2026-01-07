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

interface AirdropFiltersProps {
    status: string;
    onStatusChange: (status: string) => void;
}

export function AirdropFilters({
    status,
    onStatusChange,
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
        </div>
    );
}
