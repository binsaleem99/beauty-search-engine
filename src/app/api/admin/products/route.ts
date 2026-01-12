import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Admin API: Create Product
 * POST /api/admin/products
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

        // Insert product
        const { data: product, error } = await supabase
            .from('products')
            .insert({
                name_en: body.name_en,
                name_ar: body.name_ar,
                brand: body.brand,
                category: body.category,
                subcategory: body.subcategory || null,
                image_url: body.image_url,
                description_en: body.description_en || null,
                description_ar: body.description_ar || null,
                benefits_en: body.benefits_en || null,
                benefits_ar: body.benefits_ar || null,
                skin_types: body.skin_types || null,
                main_ingredients: body.main_ingredients || null,
                inci_list: body.inci_list || null
            })
            .select()
            .single();

        if (error) {
            console.error('[ADMIN] Product creation error:', error);
            return NextResponse.json({
                error: error.message || 'Failed to create product'
            }, { status: 500 });
        }

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN] Exception:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
