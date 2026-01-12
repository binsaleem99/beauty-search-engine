import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const trending = searchParams.get('trending');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

    const supabase = await createClient();

    let query = supabase.from('products').select('*');

    // In a real scenario, "trending" might rely on search_logs count or a specific flag
    // For now, if trending is true, we just return random or specific set
    if (trending === 'true') {
        // Just fetching some products to simulate trending
        query = query.limit(4);
    } else {
        query = query.limit(limit);
    }

    const { data: products, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enhance with lowest price (optional, could be expensive if not optimized)
    // For trending, let's fetch lowest price for each
    const productsWithPrices = await Promise.all(products.map(async (p) => {
        const { data: prices } = await supabase
            .from('prices')
            .select('price, retailer:retailers(name)')
            .eq('product_id', p.id)
            .order('price', { ascending: true })
            .limit(1);

        const retailerName = prices?.[0]?.retailer && typeof prices[0].retailer === 'object' && 'name' in prices[0].retailer
            ? (prices[0].retailer as { name: string }).name
            : null;

        return {
            ...p,
            lowest_price: prices?.[0]?.price,
            retailer_name: retailerName
        };
    }));

    return NextResponse.json({ products: productsWithPrices });
}
