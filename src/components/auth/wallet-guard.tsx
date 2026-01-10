'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/wallet-context';

interface WalletGuardProps {
    children: ReactNode;
}

export function WalletGuard({ children }: WalletGuardProps) {
    const { isConnected, isHydrated } = useWallet();
    const router = useRouter();

    useEffect(() => {
        // Wait for hydration before redirecting
        if (isHydrated && !isConnected) {
            router.push('/login');
        }
    }, [isHydrated, isConnected, router]);

    // Show loading while hydrating
    if (!isHydrated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Show loading while redirecting
    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
