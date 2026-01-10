'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Airdrop } from '@/types/database';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AirdropInfoProps {
    airdrop: Airdrop;
    onUpdate?: () => void;
}

export function AirdropInfo({ airdrop, onUpdate }: AirdropInfoProps) {
    const [name, setName] = useState(airdrop.name);
    const [funds, setFunds] = useState(airdrop.funds || '');
    const [website, setWebsite] = useState(airdrop.website || '');
    const [estimatedTge, setEstimatedTge] = useState(airdrop.estimated_tge || '');
    const [estimatedValue, setEstimatedValue] = useState(airdrop.estimated_value || '');
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const router = useRouter();

    const markChanged = () => setHasChanges(true);

    const handleSave = async () => {
        setSaving(true);
        try {
            const supabase = createClient();
            await supabase
                .from('airdrops')
                .update({
                    name,
                    funds: funds || null,
                    website: website || null,
                    estimated_tge: estimatedTge || null,
                    estimated_value: estimatedValue || null,
                })
                .eq('id', airdrop.id);
            setHasChanges(false);
            onUpdate?.();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this airdrop?')) return;

        const supabase = createClient();
        await supabase.from('airdrops').delete().eq('id', airdrop.id);
        router.push('/');
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-muted-foreground text-sm">
                        Created {new Date(airdrop.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-2">
                    {hasChanges && (
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    )}
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                <Input
                    id="name"
                    label="Project Name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); markChanged(); }}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        id="funds"
                        label="Funds Raised"
                        value={funds}
                        onChange={(e) => { setFunds(e.target.value); markChanged(); }}
                    />
                    <Input
                        id="website"
                        label="Website"
                        value={website}
                        onChange={(e) => { setWebsite(e.target.value); markChanged(); }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        id="estimated-tge"
                        label="Estimated TGE"
                        value={estimatedTge}
                        onChange={(e) => { setEstimatedTge(e.target.value); markChanged(); }}
                    />
                    <Input
                        id="estimated-value"
                        label="Estimated Airdrop Value"
                        value={estimatedValue}
                        onChange={(e) => { setEstimatedValue(e.target.value); markChanged(); }}
                    />
                </div>
            </div>
        </div>
    );
}
