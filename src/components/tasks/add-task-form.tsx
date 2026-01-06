'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TaskType } from '@/types/database';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const typeOptions = [
    { value: 'One-time', label: 'One-time' },
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
];

interface AddTaskFormProps {
    airdropId: string;
    onSuccess?: () => void;
}

export function AddTaskForm({ airdropId, onSuccess }: AddTaskFormProps) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<TaskType>('One-time');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            const supabase = createClient();
            await supabase.from('tasks').insert({
                airdrop_id: airdropId,
                title: title.trim(),
                type,
            });
            setTitle('');
            setType('One-time');
            onSuccess?.();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 mt-4 pt-4 border-t border-border">
            <div className="flex-1">
                <Input
                    id="task-title"
                    placeholder="Add a new task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="w-32">
                <Select
                    id="task-type"
                    options={typeOptions}
                    value={type}
                    onChange={(e) => setType(e.target.value as TaskType)}
                />
            </div>
            <Button type="submit" disabled={loading || !title.trim()}>
                {loading ? 'Adding...' : 'Add'}
            </Button>
        </form>
    );
}
