'use client';

import { WalletProvider } from '@/context/wallet-context';
import { Topbar } from '@/components/layout/topbar';
import { WalletGuard } from '@/components/auth/wallet-guard';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WalletProvider>
            <WalletGuard>
                <div className="min-h-screen bg-background flex flex-col">
                    <Topbar />
                    <main className="flex-1">
                        <div className="max-w-7xl mx-auto px-6 py-8">
                            {children}
                        </div>
                    </main>
                </div>
            </WalletGuard>
        </WalletProvider>
    );
}
