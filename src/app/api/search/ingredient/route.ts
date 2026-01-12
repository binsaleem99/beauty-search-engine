import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check subscription status
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

    if (userError || userData?.subscription_status !== 'premium') {
        return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 });
    }

    if (!query) {
        return NextResponse.json({ ingredients: [] });
    }

    const { data: ingredients, error } = await supabase
        .from('ingredients')
        .select('*')
        .or(`name_en.ilike.%${query}%,name_ar.ilike.%${query}%`)
        .limit(20);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ingredients });
}
