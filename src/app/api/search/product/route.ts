import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') || 'en';

    if (!query) {
        return NextResponse.json({ products: [] });
    }

    const supabase = await createClient();

    // Search by name (English or Arabic) or brand
    // Using ilike for simple case-insensitive search
    // In a real prod environment, we would use Full Text Search (to_tsvector) as defined in schema
    // But for now, simple ilike is safer/easier for the setup without complex RPCs

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .or(`name_en.ilike.%${query}%,name_ar.ilike.%${query}%,brand.ilike.%${query}%`)
        .limit(20);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products });
}
