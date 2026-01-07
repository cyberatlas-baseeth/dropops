'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AddAirdropModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function AddAirdropModal({ isOpen, onClose, onSuccess }: AddAirdropModalProps) {
    const { address } = useWallet();
    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [funds, setFunds] = useState('');
    const [estimatedTge, setEstimatedTge] = useState('');
    const [estimatedValue, setEstimatedValue] = useState('');
    const [stepsSummary, setStepsSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = () => {
        setName('');
        setWebsite('');
        setFunds('');
        setEstimatedTge('');
        setEstimatedValue('');
        setStepsSummary('');
    };

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
                website: website || null,
                funds: funds || null,
                estimated_tge: estimatedTge || null,
                estimated_value: estimatedValue || null,
                steps_summary: stepsSummary || null,
            });

            if (insertError) throw insertError;

            resetForm();
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
                    label="Project Name *"
                    placeholder=""
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Input
                    id="funds"
                    label="Funds Raised"
                    placeholder=""
                    value={funds}
                    onChange={(e) => setFunds(e.target.value)}
                />

                <Input
                    id="website"
                    label="Website"
                    placeholder=""
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        id="estimated-tge"
                        label="Estimated TGE"
                        placeholder=""
                        value={estimatedTge}
                        onChange={(e) => setEstimatedTge(e.target.value)}
                    />

                    <Input
                        id="estimated-value"
                        label="Est. Airdrop Value"
                        placeholder=""
                        value={estimatedValue}
                        onChange={(e) => setEstimatedValue(e.target.value)}
                    />
                </div>

                <Textarea
                    id="steps-summary"
                    label="Steps"
                    placeholder=""
                    value={stepsSummary}
                    onChange={(e) => setStepsSummary(e.target.value)}
                    rows={2}
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
