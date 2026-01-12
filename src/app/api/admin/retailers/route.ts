import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Admin API: Get All Retailers
 * GET /api/admin/retailers
 */
export async function GET() {
    const supabase = await createClient();

    // Check admin authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || user.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { data: retailers, error } = await supabase
            .from('retailers')
            .select('*')
            .order('name_en');

        if (error) {
            return NextResponse.json({
                error: error.message || 'Failed to fetch retailers'
            }, { status: 500 });
        }

        return NextResponse.json({ retailers });
    } catch (error) {
        console.error('[ADMIN] Exception:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
