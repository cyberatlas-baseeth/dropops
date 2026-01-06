'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Airdrop, AirdropStatus } from '@/types/database';
import { Select } from '@/components/ui/select';
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
    const [status, setStatus] = useState<AirdropStatus>(airdrop.status);
    const [notes, setNotes] = useState(airdrop.notes || '');
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const router = useRouter();

    const handleStatusChange = (newStatus: AirdropStatus) => {
        setStatus(newStatus);
        setHasChanges(true);
    };

    const handleNotesChange = (newNotes: string) => {
        setNotes(newNotes);
        setHasChanges(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const supabase = createClient();
            await supabase
                .from('airdrops')
                .update({ status, notes })
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
                    <h1 className="text-2xl font-bold text-foreground">{airdrop.name}</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {airdrop.network || 'No network specified'} • Created{' '}
                        {new Date(airdrop.created_at).toLocaleDateString()}
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
                <div className="w-48">
                    <Select
                        id="status"
                        label="Status"
                        options={statusOptions}
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value as AirdropStatus)}
                    />
                </div>

                <Textarea
                    id="notes"
                    label="Notes"
                    placeholder="Add notes about this airdrop..."
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    rows={4}
                />
            </div>
        </div>
    );
}
