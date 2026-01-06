import { createClient } from '@/lib/supabase/server';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { Airdrop } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    try {
        const supabase = await createClient();

        const { data: airdrops } = await supabase
            .from('airdrops')
            .select('*')
            .order('created_at', { ascending: false });

        return <DashboardClient airdrops={(airdrops as Airdrop[]) || []} />;
    } catch {
        return <DashboardClient airdrops={[]} />;
    }
}
