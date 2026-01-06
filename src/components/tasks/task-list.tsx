'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Task } from '@/types/database';

interface TaskListProps {
    tasks: Task[];
    airdropId: string;
}

const typeColors: Record<string, string> = {
    'Daily': 'bg-blue-500/10 text-blue-600',
    'Weekly': 'bg-purple-500/10 text-purple-600',
    'One-time': 'bg-gray-500/10 text-gray-600',
};

export function TaskList({ tasks, airdropId }: TaskListProps) {
    const [localTasks, setLocalTasks] = useState(tasks);
    const router = useRouter();
    const supabase = createClient();

    const handleToggle = async (task: Task) => {
        const newCompleted = !task.is_completed;
        const now = newCompleted ? new Date().toISOString() : null;

        setLocalTasks((prev) =>
            prev.map((t) =>
                t.id === task.id
                    ? { ...t, is_completed: newCompleted, last_completed_at: now }
                    : t
            )
        );

        await supabase
            .from('tasks')
            .update({
                is_completed: newCompleted,
                last_completed_at: now,
            })
            .eq('id', task.id);

        router.refresh();
    };

    const handleDelete = async (taskId: string) => {
        setLocalTasks((prev) => prev.filter((t) => t.id !== taskId));
        await supabase.from('tasks').delete().eq('id', taskId);
        router.refresh();
    };

    if (localTasks.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>No tasks yet. Add your first task below.</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-border">
            {localTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-3">
                    <button
                        onClick={() => handleToggle(task)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${task.is_completed
                                ? 'bg-primary border-primary'
                                : 'border-border hover:border-primary'
                            }`}
                    >
                        {task.is_completed && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-primary-foreground"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        )}
                    </button>

                    <div className="flex-1">
                        <p
                            className={`text-sm font-medium ${task.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'
                                }`}
                        >
                            {task.title}
                        </p>
                        {task.last_completed_at && (
                            <p className="text-xs text-muted-foreground">
                                Last completed: {new Date(task.last_completed_at).toLocaleDateString()}
                            </p>
                        )}
                    </div>

                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${typeColors[task.type] || 'bg-gray-500/10 text-gray-600'
                            }`}
                    >
                        {task.type}
                    </span>

                    <button
                        onClick={() => handleDelete(task.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
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
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}
