'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useWallet } from '@/context/wallet-context';

interface Task {
    id: string;
    wallet_address: string;
    title: string;
    is_completed: boolean;
    task_type: 'daily' | 'todo';
    created_at: string;
}

export default function TasksPage() {
    const { address } = useWallet();
    const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
    const [todoTasks, setTodoTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [newDailyTask, setNewDailyTask] = useState('');
    const [newTodoTask, setNewTodoTask] = useState('');
    const [addingDaily, setAddingDaily] = useState(false);
    const [addingTodo, setAddingTodo] = useState(false);

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

            const allTasks = (data as Task[]) || [];
            setDailyTasks(allTasks.filter(t => t.task_type === 'daily' || !t.task_type));
            setTodoTasks(allTasks.filter(t => t.task_type === 'todo'));
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [address]);

    const addTask = async (title: string, taskType: 'daily' | 'todo') => {
        if (!address || !title.trim()) return;

        const setAdding = taskType === 'daily' ? setAddingDaily : setAddingTodo;
        const setNewTask = taskType === 'daily' ? setNewDailyTask : setNewTodoTask;

        setAdding(true);
        try {
            const supabase = createClient();
            await supabase.from('daily_tasks').insert({
                wallet_address: address.toLowerCase(),
                title: title.trim(),
                is_completed: false,
                task_type: taskType,
            });
            setNewTask('');
            fetchTasks();
        } catch (error) {
            console.error('Failed to add task:', error);
        } finally {
            setAdding(false);
        }
    };

    const toggleTask = async (taskId: string, isCompleted: boolean, taskType: 'daily' | 'todo') => {
        try {
            const supabase = createClient();
            await supabase
                .from('daily_tasks')
                .update({ is_completed: !isCompleted })
                .eq('id', taskId);

            const setTasks = taskType === 'daily' ? setDailyTasks : setTodoTasks;
            const tasks = taskType === 'daily' ? dailyTasks : todoTasks;
            setTasks(tasks.map(t =>
                t.id === taskId ? { ...t, is_completed: !isCompleted } : t
            ));
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const deleteTask = async (taskId: string, taskType: 'daily' | 'todo') => {
        try {
            const supabase = createClient();
            await supabase.from('daily_tasks').delete().eq('id', taskId);
            const setTasks = taskType === 'daily' ? setDailyTasks : setTodoTasks;
            const tasks = taskType === 'daily' ? dailyTasks : todoTasks;
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

    const TaskBox = ({
        title,
        icon,
        tasks,
        newTask,
        setNewTask,
        adding,
        onAdd,
        taskType,
    }: {
        title: string;
        icon: React.ReactNode;
        tasks: Task[];
        newTask: string;
        setNewTask: (v: string) => void;
        adding: boolean;
        onAdd: () => void;
        taskType: 'daily' | 'todo';
    }) => {
        const completedCount = tasks.filter(t => t.is_completed).length;

        return (
            <div className="bg-card border border-border rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                        {icon}
                    </div>
                    <div>
                        <h2 className="font-semibold text-foreground">{title}</h2>
                        <p className="text-xs text-muted-foreground">
                            {completedCount} of {tasks.length} completed
                        </p>
                    </div>
                    {tasks.length > 0 && (
                        <div className="ml-auto w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                                style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
                            />
                        </div>
                    )}
                </div>

                {/* Add Task Form */}
                <form
                    onSubmit={(e) => { e.preventDefault(); onAdd(); }}
                    className="flex gap-2 mb-4"
                >
                    <input
                        type="text"
                        placeholder="Add a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <button
                        type="submit"
                        disabled={adding || !newTask.trim()}
                        className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {adding ? '...' : 'Add'}
                    </button>
                </form>

                {/* Task List */}
                {tasks.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                        <p>No tasks yet</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${task.is_completed
                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                    : 'bg-background border-border hover:border-muted-foreground/30'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleTask(task.id, task.is_completed, taskType)}
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${task.is_completed
                                        ? 'bg-emerald-500 border-emerald-500'
                                        : 'border-muted-foreground/50 hover:border-emerald-500'
                                        }`}
                                >
                                    {task.is_completed && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>
                                <span className={`flex-1 text-sm ${task.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {task.title}
                                </span>
                                <button
                                    onClick={() => deleteTask(task.id, taskType)}
                                    className="p-1 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your daily tasks and to-do list
                </p>
            </div>

            {/* Task Boxes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Tasks */}
                <TaskBox
                    title="Daily Tasks"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    }
                    tasks={dailyTasks}
                    newTask={newDailyTask}
                    setNewTask={setNewDailyTask}
                    adding={addingDaily}
                    onAdd={() => addTask(newDailyTask, 'daily')}
                    taskType="daily"
                />

                {/* To-Do List */}
                <TaskBox
                    title="To-Do List"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500">
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                    }
                    tasks={todoTasks}
                    newTask={newTodoTask}
                    setNewTask={setNewTodoTask}
                    adding={addingTodo}
                    onAdd={() => addTask(newTodoTask, 'todo')}
                    taskType="todo"
                />
            </div>
        </div>
    );
}
