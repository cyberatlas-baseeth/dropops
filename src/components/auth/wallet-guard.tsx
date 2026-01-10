'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/wallet-context';

interface WalletGuardProps {
    children: ReactNode;
}

export function WalletGuard({ children }: WalletGuardProps) {
    const { isConnected, address } = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (!isConnected && !address) {
            router.push('/login');
        }
    }, [isConnected, address, router]);

    if (!isConnected && !address) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
