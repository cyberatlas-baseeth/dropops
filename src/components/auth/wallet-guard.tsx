'use client';

import { ReactNode } from 'react';

interface WalletGuardProps {
    children: ReactNode;
}

export function WalletGuard({ children }: WalletGuardProps) {
    // Temporarily disabled for testing
    return <>{children}</>;
}
