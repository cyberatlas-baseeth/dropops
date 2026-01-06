'use client';

import { WalletProvider } from '@/context/wallet-context';
import { Sidebar } from '@/components/layout/sidebar';
import { WalletGuard } from '@/components/auth/wallet-guard';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WalletProvider>
            <WalletGuard>
                <div className="min-h-screen bg-background">
                    <Sidebar />
                    {/* Main content with left margin for sidebar on desktop */}
                    <main className="lg:ml-56">
                        <div className="p-4 pt-16 lg:p-6 lg:pt-6">{children}</div>
                    </main>
                </div>
            </WalletGuard>
        </WalletProvider>
    );
}
