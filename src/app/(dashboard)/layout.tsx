import { Sidebar } from '@/components/layout/sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            redirect('/login');
        }
    } catch {
        // Supabase not configured, redirect to login
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="lg:pl-56">
                <div className="p-4 pt-16 lg:p-8 lg:pt-8">{children}</div>
            </main>
        </div>
    );
}
