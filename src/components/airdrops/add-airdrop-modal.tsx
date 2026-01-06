'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AirdropStatus } from '@/types/database';

const statusOptions = [
    { value: 'Tracking', label: 'Tracking' },
    { value: 'Active', label: 'Active' },
    { value: 'Snapshot Taken', label: 'Snapshot Taken' },
    { value: 'Claimed', label: 'Claimed' },
    { value: 'Dropped', label: 'Dropped' },
];

const networkOptions = [
    { value: '', label: 'Select network' },
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

interface AddAirdropModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function AddAirdropModal({ isOpen, onClose, onSuccess }: AddAirdropModalProps) {
    const { address } = useWallet();
    const [name, setName] = useState('');
    const [network, setNetwork] = useState('');
    const [status, setStatus] = useState<AirdropStatus>('Tracking');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) {
            setError('Wallet not connected');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const supabase = createClient();
            const { error: insertError } = await supabase.from('airdrops').insert({
                wallet_address: address.toLowerCase(),
                name,
                network: network || null,
                status,
                notes: notes || null,
            });

            if (insertError) throw insertError;

            setName('');
            setNetwork('');
            setStatus('Tracking');
            setNotes('');
            onClose();
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create airdrop');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Airdrop">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="name"
                    label="Name"
                    placeholder="e.g., LayerZero"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Select
                    id="network"
                    label="Network"
                    options={networkOptions}
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                />

                <Select
                    id="status"
                    label="Status"
                    options={statusOptions}
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AirdropStatus)}
                />

                <Textarea
                    id="notes"
                    label="Notes"
                    placeholder="Add any notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
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
                        {loading ? 'Adding...' : 'Add Airdrop'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
