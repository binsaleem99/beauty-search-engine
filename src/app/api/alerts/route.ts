import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check subscription status
    const { data: userData } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

    const isPremium = userData?.subscription_status === 'premium';

    if (!isPremium) {
        return NextResponse.json({ error: 'Price alerts are a Premium feature.' }, { status: 403 });
    }

    const body = await request.json();
    const { product_id, target_price } = body;

    if (!product_id) {
        return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Get current price
    const { data: prices } = await supabase
        .from('prices')
        .select('price')
        .eq('product_id', product_id)
        .order('price', { ascending: true })
        .limit(1);

    const currentPrice = prices?.[0]?.price || 0;

    const { data, error } = await supabase
        .from('price_alerts')
        .insert({
            user_id: user.id,
            product_id,
            target_price,
            current_price: currentPrice
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ alert: data });
}
