'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider } from 'ethers';
import { WALLET_CONFIG, WalletSession } from '@/lib/wallet/config';
import { createClient } from '@/lib/supabase/client';

interface WalletContextType {
    address: string | null;
    isConnecting: boolean;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    isConnected: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check for existing session on mount
    useEffect(() => {
        const stored = localStorage.getItem(WALLET_CONFIG.SESSION_KEY);
        if (stored) {
            try {
                const session: WalletSession = JSON.parse(stored);
                // Session valid for 7 days
                if (Date.now() - session.connectedAt < 7 * 24 * 60 * 60 * 1000) {
                    setAddress(session.address);
                } else {
                    localStorage.removeItem(WALLET_CONFIG.SESSION_KEY);
                }
            } catch {
                localStorage.removeItem(WALLET_CONFIG.SESSION_KEY);
            }
        }
    }, []);

    // Listen for account changes
    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            const handleAccountsChanged = (...args: unknown[]) => {
                const accounts = args[0] as string[];
                if (accounts.length === 0) {
                    disconnect();
                } else if (accounts[0] !== address) {
                    // Account changed, require re-authentication
                    disconnect();
                }
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            return () => {
                window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, [address]);

    // Save user to Supabase
    const saveUserToSupabase = async (walletAddress: string) => {
        try {
            const supabase = createClient();
            await supabase.from('users').upsert(
                { wallet_address: walletAddress.toLowerCase() },
                { onConflict: 'wallet_address' }
            );
        } catch (err) {
            console.error('Failed to save user:', err);
        }
    };

    const connect = async () => {
        if (typeof window === 'undefined' || !window.ethereum) {
            setError('Please install MetaMask to continue');
            return;
        }

        setIsConnecting(true);
        setError(null);

        try {
            const provider = new BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);

            if (accounts.length === 0) {
                throw new Error('No accounts found');
            }

            const walletAddress = accounts[0];
            const signer = await provider.getSigner();

            // Create and sign message
            const nonce = WALLET_CONFIG.generateNonce();
            const message = WALLET_CONFIG.getSignMessage(walletAddress, nonce);

            await signer.signMessage(message);

            // Save user to Supabase
            await saveUserToSupabase(walletAddress);

            // Save session locally
            const session: WalletSession = {
                address: walletAddress,
                connectedAt: Date.now(),
            };
            localStorage.setItem(WALLET_CONFIG.SESSION_KEY, JSON.stringify(session));
            setAddress(walletAddress);
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes('user rejected')) {
                    setError('Connection cancelled');
                } else {
                    setError(err.message);
                }
            } else {
                setError('Failed to connect wallet');
            }
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnect = () => {
        localStorage.removeItem(WALLET_CONFIG.SESSION_KEY);
        setAddress(null);
    };

    return (
        <WalletContext.Provider
            value={{
                address,
                isConnecting,
                error,
                connect,
                disconnect,
                isConnected: !!address,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
