'use client';

import { useWallet } from '@/context/wallet-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface WalletGuardProps {
    children: ReactNode;
}

export function WalletGuard({ children }: WalletGuardProps) {
    const { isConnected, address } = useWallet();
    const router = useRouter();

    useEffect(() => {
        // Small delay to allow localStorage check
        const timer = setTimeout(() => {
            if (!isConnected && !address) {
                router.push('/login');
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [isConnected, address, router]);

    // Show loading while checking auth
    if (!isConnected && !address) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
