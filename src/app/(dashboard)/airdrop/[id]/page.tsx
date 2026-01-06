'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AirdropInfo } from '@/components/airdrops/airdrop-info';
import { TaskList } from '@/components/tasks/task-list';
import { AddTaskForm } from '@/components/tasks/add-task-form';
import { Airdrop, Task } from '@/types/database';

interface AirdropDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function AirdropDetailPage({ params }: AirdropDetailPageProps) {
    const { id } = use(params);
    const { address } = useWallet();
    const router = useRouter();
    const [airdrop, setAirdrop] = useState<Airdrop | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!address) return;

        try {
            const supabase = createClient();

            const { data: airdropData } = await supabase
                .from('airdrops')
                .select('*')
                .eq('id', id)
                .eq('wallet_address', address.toLowerCase())
                .single();

            if (!airdropData) {
                router.push('/');
                return;
            }

            setAirdrop(airdropData as Airdrop);

            const { data: tasksData } = await supabase
                .from('tasks')
                .select('*')
                .eq('airdrop_id', id)
                .order('created_at', { ascending: true });

            setTasks((tasksData as Task[]) || []);
        } catch (error) {
            console.error('Failed to fetch airdrop:', error);
            router.push('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [address, id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!airdrop) {
        return null;
    }

    return (
        <div className="max-w-3xl">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Dashboard
            </Link>

            <AirdropInfo airdrop={airdrop} onUpdate={fetchData} />

            <div className="mt-6 bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Tasks</h2>
                <TaskList tasks={tasks} airdropId={id} onUpdate={fetchData} />
                <AddTaskForm airdropId={id} onSuccess={fetchData} />
            </div>
        </div>
    );
}
