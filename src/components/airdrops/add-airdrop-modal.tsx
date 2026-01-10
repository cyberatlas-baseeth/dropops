'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    const [steps, setSteps] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = () => {
        setName('');
        setWebsite('');
        setFunds('');
        setEstimatedTge('');
        setEstimatedValue('');
        setSteps(['']);
    };

    const addStepField = () => {
        setSteps([...steps, '']);
    };

    const updateStep = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const removeStep = (index: number) => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, i) => i !== index));
        }
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

            // Create airdrop
            const { data: airdropData, error: insertError } = await supabase
                .from('airdrops')
                .insert({
                    wallet_address: address.toLowerCase(),
                    name,
                    website: website || null,
                    funds: funds || null,
                    estimated_tge: estimatedTge || null,
                    estimated_value: estimatedValue || null,
                })
                .select('id')
                .single();

            if (insertError) throw insertError;

            // Add steps
            const validSteps = steps.filter(s => s.trim());
            if (validSteps.length > 0 && airdropData) {
                await supabase.from('steps').insert(
                    validSteps.map(title => ({
                        airdrop_id: airdropData.id,
                        title: title.trim(),
                        is_completed: false,
                    }))
                );
            }

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

                {/* Steps */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Steps</label>
                    <div className="space-y-2">
                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder={`Step ${index + 1}`}
                                    value={step}
                                    onChange={(e) => updateStep(index, e.target.value)}
                                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                                {steps.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeStep(index)}
                                        className="px-2 text-muted-foreground hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addStepField}
                        className="mt-2 text-sm text-emerald-500 hover:text-emerald-400"
                    >
                        + Add Step
                    </button>
                </div>

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
