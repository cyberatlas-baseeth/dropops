'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Airdrop, CostType } from '@/types/database';

const costTypeOptions = [
    { value: 'Gas Fee', label: 'Gas Fee' },
    { value: 'Other', label: 'Other Cost' },
    { value: 'Claimed Reward', label: 'Claimed Reward' },
];

interface AddCostModalProps {
    isOpen: boolean;
    onClose: () => void;
    airdrops: Airdrop[];
    onSuccess?: () => void;
}

export function AddCostModal({ isOpen, onClose, airdrops, onSuccess }: AddCostModalProps) {
    const [airdropId, setAirdropId] = useState('');
    const [costType, setCostType] = useState<CostType>('Gas Fee');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const airdropOptions = [
        { value: '', label: 'Select airdrop' },
        ...airdrops.map((a) => ({ value: a.id, label: a.name })),
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!airdropId) throw new Error('Please select an airdrop');
            if (!amount || parseFloat(amount) <= 0) throw new Error('Please enter a valid amount');

            const supabase = createClient();
            const { error: insertError } = await supabase.from('finance').insert({
                airdrop_id: airdropId,
                cost_type: costType,
                amount: parseFloat(amount),
            });

            if (insertError) throw insertError;

            setAirdropId('');
            setCostType('Gas Fee');
            setAmount('');
            onClose();
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add entry');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Finance Entry">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                    id="airdrop"
                    label="Airdrop"
                    options={airdropOptions}
                    value={airdropId}
                    onChange={(e) => setAirdropId(e.target.value)}
                />

                <Select
                    id="cost-type"
                    label="Type"
                    options={costTypeOptions}
                    value={costType}
                    onChange={(e) => setCostType(e.target.value as CostType)}
                />

                <Input
                    id="amount"
                    type="number"
                    label="Amount (USD)"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                {error && (
                    <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                        {error}
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? 'Adding...' : 'Add Entry'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
