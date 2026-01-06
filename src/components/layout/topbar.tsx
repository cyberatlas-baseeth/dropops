'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/context/wallet-context';

const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Finance', href: '/finance' },
];

function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function Topbar() {
    const pathname = usePathname();
    const { address, disconnect } = useWallet();

    return (
        <header className="fixed top-0 left-0 right-0 h-14 z-50">
            <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xs">DO</span>
                    </div>
                    <span className="font-semibold text-foreground">DropOps</span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-1 bg-card/80 backdrop-blur-sm border border-border rounded-full px-1 py-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isActive
                                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                                        : 'text-muted-foreground hover:text-foreground'
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
                        <div className="px-3 py-1.5 bg-card/80 backdrop-blur-sm border border-border rounded-full">
                            <span className="text-sm font-mono text-foreground">{truncateAddress(address)}</span>
                        </div>
                    )}
                    <button
                        onClick={() => disconnect()}
                        className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-card/80 backdrop-blur-sm border border-border rounded-full transition-colors"
                    >
                        Disconnect
                    </button>
                </div>
            </div>
        </header>
    );
}
