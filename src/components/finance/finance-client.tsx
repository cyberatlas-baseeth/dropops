'use client';

import { useState } from 'react';
import { Airdrop, AirdropWithFinance } from '@/types/database';
import { Button } from '@/components/ui/button';
import { FinanceTable } from '@/components/finance/finance-table';
import { AddCostModal } from '@/components/finance/add-cost-modal';

interface FinanceClientProps {
    data: AirdropWithFinance[];
    airdrops: Airdrop[];
}

export function FinanceClient({ data, airdrops }: FinanceClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Finance</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track costs and returns across your airdrops
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Entry
                </Button>
            </div>

            <FinanceTable data={data} />

            <AddCostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                airdrops={airdrops}
            />
        </>
    );
}
