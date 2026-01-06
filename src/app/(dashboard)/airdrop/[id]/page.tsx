import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AirdropInfo } from '@/components/airdrops/airdrop-info';
import { TaskList } from '@/components/tasks/task-list';
import { AddTaskForm } from '@/components/tasks/add-task-form';
import { Airdrop, Task } from '@/types/database';

export const dynamic = 'force-dynamic';

interface AirdropDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function AirdropDetailPage({ params }: AirdropDetailPageProps) {
    const { id } = await params;

    try {
        const supabase = await createClient();

        const { data: airdrop } = await supabase
            .from('airdrops')
            .select('*')
            .eq('id', id)
            .single();

        if (!airdrop) {
            notFound();
        }

        const { data: tasks } = await supabase
            .from('tasks')
            .select('*')
            .eq('airdrop_id', id)
            .order('created_at', { ascending: true });

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

                <AirdropInfo airdrop={airdrop as Airdrop} />

                <div className="mt-6 bg-card border border-border rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Tasks</h2>
                    <TaskList tasks={(tasks as Task[]) || []} airdropId={id} />
                    <AddTaskForm airdropId={id} />
                </div>
            </div>
        );
    } catch {
        notFound();
    }
}
