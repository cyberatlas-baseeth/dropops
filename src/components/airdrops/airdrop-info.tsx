'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Airdrop, AirdropStatus } from '@/types/database';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const statusOptions = [
    { value: 'Tracking', label: 'Tracking' },
    { value: 'Active', label: 'Active' },
    { value: 'Snapshot Taken', label: 'Snapshot Taken' },
    { value: 'Claimed', label: 'Claimed' },
    { value: 'Dropped', label: 'Dropped' },
];

interface AirdropInfoProps {
    airdrop: Airdrop;
    onUpdate?: () => void;
}

export function AirdropInfo({ airdrop, onUpdate }: AirdropInfoProps) {
    const [name, setName] = useState(airdrop.name);
    const [status, setStatus] = useState<AirdropStatus>(airdrop.status);
    const [funds, setFunds] = useState(airdrop.funds || '');
    const [website, setWebsite] = useState(airdrop.website || '');
    const [estimatedTge, setEstimatedTge] = useState(airdrop.estimated_tge || '');
    const [estimatedValue, setEstimatedValue] = useState(airdrop.estimated_value || '');
    const [tasksSummary, setTasksSummary] = useState(airdrop.tasks_summary || '');
    const [notes, setNotes] = useState(airdrop.notes || '');
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
                    status,
                    funds: funds || null,
                    website: website || null,
                    estimated_tge: estimatedTge || null,
                    estimated_value: estimatedValue || null,
                    tasks_summary: tasksSummary || null,
                    notes: notes || null,
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
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        id="name"
                        label="Project Name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); markChanged(); }}
                    />
                    <div className="w-48">
                        <Select
                            id="status"
                            label="Status"
                            options={statusOptions}
                            value={status}
                            onChange={(e) => { setStatus(e.target.value as AirdropStatus); markChanged(); }}
                        />
                    </div>
                </div>

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

                <Textarea
                    id="tasks-summary"
                    label="Tasks"
                    value={tasksSummary}
                    onChange={(e) => { setTasksSummary(e.target.value); markChanged(); }}
                    rows={2}
                />

                <Textarea
                    id="notes"
                    label="Notes"
                    value={notes}
                    onChange={(e) => { setNotes(e.target.value); markChanged(); }}
                    rows={3}
                />
            </div>
        </div>
    );
}
