'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import type { SupabaseClient } from '@supabase/supabase-js';

interface AuthFormProps {
    mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const router = useRouter();

    useEffect(() => {
        try {
            const client = createClient();
            setSupabase(client);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Supabase not configured');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            setError('Supabase is not configured. Please set environment variables.');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
            }
            router.push('/');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-lg">DO</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                    {mode === 'login' ? 'Welcome back' : 'Create an account'}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {mode === 'login'
                        ? 'Sign in to your account to continue'
                        : 'Get started with DropOps'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />

                {error && (
                    <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={loading || !supabase}>
                    {loading ? 'Loading...' : mode === 'login' ? 'Sign in' : 'Sign up'}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
                {mode === 'login' ? (
                    <>
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-foreground hover:underline font-medium">
                            Sign up
                        </Link>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <Link href="/login" className="text-foreground hover:underline font-medium">
                            Sign in
                        </Link>
                    </>
                )}
            </p>
        </div>
    );
}
