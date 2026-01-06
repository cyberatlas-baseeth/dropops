'use client';

import { useWallet } from '@/context/wallet-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function ConnectWallet() {
    const { connect, isConnecting, error, isConnected } = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (isConnected) {
            router.push('/');
            router.refresh();
        }
    }, [isConnected, router]);

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-xl">DO</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Welcome to DropOps</h1>
                <p className="text-muted-foreground mt-2">
                    Connect your wallet to start tracking airdrops
                </p>
            </div>

            <div className="space-y-4">
                <Button
                    onClick={connect}
                    disabled={isConnecting}
                    className="w-full h-12 text-base"
                >
                    {isConnecting ? (
                        <span className="flex items-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Connecting...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Connect with MetaMask
                        </span>
                    )}
                </Button>

                {error && (
                    <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md text-center">
                        {error}
                    </div>
                )}

                <p className="text-center text-xs text-muted-foreground">
                    By connecting, you agree to sign a message to verify wallet ownership.
                    <br />
                    No gas fees required.
                </p>
            </div>
        </div>
    );
}
