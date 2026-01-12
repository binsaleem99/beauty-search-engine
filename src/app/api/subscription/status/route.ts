import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: 'unauthorized', is_premium: false });
    }

    const { data: userData, error } = await supabase
        .from('users')
        .select('subscription_status, subscription_ends_at')
        .eq('id', user.id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const isPremium = userData.subscription_status === 'premium';

    return NextResponse.json({
        status: userData.subscription_status,
        is_premium: isPremium,
        ends_at: userData.subscription_ends_at
    });
}
