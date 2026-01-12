import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Admin API: Get All Ingredients
 * GET /api/admin/ingredients
 */
export async function GET() {
    const supabase = await createClient();

    // Check admin authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || user.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { data: ingredients, error } = await supabase
            .from('ingredients')
            .select('*')
            .order('name_en');

        if (error) {
            return NextResponse.json({
                error: error.message || 'Failed to fetch ingredients'
            }, { status: 500 });
        }

        return NextResponse.json({ ingredients });
    } catch (error) {
        console.error('[ADMIN] Exception:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
