'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/context/wallet-context';

const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Tasks', href: '/tasks' },
    { name: 'Finance', href: '/finance' },
];

function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function Topbar() {
    const pathname = usePathname();
    const { address, disconnect } = useWallet();

    return (
        <header className="h-16 bg-card border-b border-border">
            <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">DO</span>
                    </div>
                    <span className="font-semibold text-foreground">DropOps</span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Wallet */}
                <div className="flex items-center gap-3">
                    {address && (
                        <div className="px-3 py-1.5 bg-muted rounded-lg">
                            <span className="text-sm font-mono text-foreground">{truncateAddress(address)}</span>
                        </div>
                    )}
                    <button
                        onClick={() => disconnect()}
                        className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Disconnect
                    </button>
                </div>
            </div>
        </header>
    );
}
