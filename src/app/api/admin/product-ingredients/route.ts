import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Admin API: Link Ingredient to Product
 * POST /api/admin/product-ingredients
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

        // Insert product-ingredient link
        const { data: link, error } = await supabase
            .from('product_ingredients')
            .insert({
                product_id: body.product_id,
                ingredient_id: body.ingredient_id,
                concentration: body.concentration || null
            })
            .select()
            .single();

        if (error) {
            console.error('[ADMIN] Product-ingredient link error:', error);
            return NextResponse.json({
                error: error.message || 'Failed to link ingredient'
            }, { status: 500 });
        }

        return NextResponse.json({ link }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN] Exception:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
