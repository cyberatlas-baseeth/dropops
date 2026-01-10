'use client';

import { WalletProvider } from '@/context/wallet-context';
import { ConnectWallet } from '@/components/auth/connect-wallet';

export default function LoginPage() {
    return (
        <WalletProvider>
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <ConnectWallet />
            </div>
        </WalletProvider>
    );
}
