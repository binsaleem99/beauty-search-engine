import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: saved, error } = await supabase
        .from('saved_products')
        .select(`
      *,
      product:products(*)
    `)
        .eq('user_id', user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved });
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { product_id, list_name = 'default' } = body;

    if (!product_id) {
        return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Check subscription status
    const { data: userData } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

    const isPremium = userData?.subscription_status === 'premium';

    // Check limit if free
    if (!isPremium) {
        const { count, error: countError } = await supabase
            .from('saved_products')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (countError) return NextResponse.json({ error: countError.message }, { status: 500 });

        if (count !== null && count >= 5) {
            return NextResponse.json({ error: 'Free limit reached (max 5 saved items). Upgrade to Premium.' }, { status: 403 });
        }
    }

    const { data, error } = await supabase
        .from('saved_products')
        .insert({
            user_id: user.id,
            product_id,
            list_name
        })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') { // Unique violation
            return NextResponse.json({ message: 'Already saved' }, { status: 200 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved: data });
}
