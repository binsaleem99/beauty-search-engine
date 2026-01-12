import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Admin API: Delete Product
 * DELETE /api/admin/products/[id]
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const supabase = await createClient();

    // Check admin authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || user.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        // Delete product (cascades to prices, product_ingredients, saved_products)
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('[ADMIN] Product deletion error:', error);
            return NextResponse.json({
                error: error.message || 'Failed to delete product'
            }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN] Exception:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
