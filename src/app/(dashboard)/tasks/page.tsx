'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';

interface DailyTask {
    id: string;
    wallet_address: string;
    title: string;
    is_completed: boolean;
    created_at: string;
}

export default function TasksPage() {
    const { address } = useWallet();
    const [tasks, setTasks] = useState<DailyTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [adding, setAdding] = useState(false);

    const fetchTasks = async () => {
        if (!address) {
            setLoading(false);
            return;
        }

        try {
            const supabase = createClient();
            const { data } = await supabase
                .from('daily_tasks')
                .select('*')
                .eq('wallet_address', address.toLowerCase())
                .order('created_at', { ascending: false });

            setTasks((data as DailyTask[]) || []);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [address]);

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address || !newTask.trim()) return;

        setAdding(true);
        try {
            const supabase = createClient();
            await supabase.from('daily_tasks').insert({
                wallet_address: address.toLowerCase(),
                title: newTask.trim(),
                is_completed: false,
            });
            setNewTask('');
            fetchTasks();
        } catch (error) {
            console.error('Failed to add task:', error);
        } finally {
            setAdding(false);
        }
    };

    const toggleTask = async (taskId: string, isCompleted: boolean) => {
        try {
            const supabase = createClient();
            await supabase
                .from('daily_tasks')
                .update({ is_completed: !isCompleted })
                .eq('id', taskId);

            setTasks(tasks.map(t =>
                t.id === taskId ? { ...t, is_completed: !isCompleted } : t
            ));
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            const supabase = createClient();
            await supabase.from('daily_tasks').delete().eq('id', taskId);
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const completedCount = tasks.filter(t => t.is_completed).length;

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Daily Tasks</h1>
                <p className="text-muted-foreground mt-1">
                    Track your daily airdrop activities
                </p>
            </div>

            {/* Task Box */}
            <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
                {/* Progress */}
                <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-muted-foreground">
                        {completedCount} of {tasks.length} tasks completed
                    </span>
                    {tasks.length > 0 && (
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                            />
                        </div>
                    )}
                </div>

                {/* Add Task Form */}
                <form onSubmit={addTask} className="flex gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Add a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <button
                        type="submit"
                        disabled={adding || !newTask.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {adding ? 'Adding...' : 'Add'}
                    </button>
                </form>

                {/* Task List */}
                {tasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No tasks yet. Add your first task above!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${task.is_completed
                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                        : 'bg-background border-border hover:border-muted-foreground/30'
                                    }`}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={() => toggleTask(task.id, task.is_completed)}
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${task.is_completed
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : 'border-muted-foreground/50 hover:border-emerald-500'
                                        }`}
                                >
                                    {task.is_completed && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>

                                {/* Task Title */}
                                <span className={`flex-1 ${task.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {task.title}
                                </span>

                                {/* Delete Button */}
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
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
                )}
            </div>
        </div>
    );
}
