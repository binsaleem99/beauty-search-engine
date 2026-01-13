import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Admin API: Add Price
 * POST /api/admin/prices
 */
export async function POST(request: Request) {
    const supabase = await createClient();

    // Check admin authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || user.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();

        // Insert price
        const { data: price, error } = await supabase
            .from('prices')
            .insert({
                product_id: body.product_id,
                retailer_id: body.retailer_id,
                price: body.price,
                url: body.url,
                in_stock: body.in_stock !== false,
                last_checked: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('[ADMIN] Price creation error:', error);
            return NextResponse.json({
                error: error.message || 'Failed to add price'
            }, { status: 500 });
        }

        // Log to price_history
        await supabase.from('price_history').insert({
            price_id: price.id,
            price: body.price
        });

        return NextResponse.json({ price }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN] Exception:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
