'use client';

import { WalletProvider } from '@/context/wallet-context';
import { Topbar } from '@/components/layout/topbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WalletProvider>
            <div className="min-h-screen bg-background flex flex-col">
                <Topbar />
                <main className="flex-1">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                        {children}
                    </div>
                </main>
            </div>
        </WalletProvider>
    );
}
