import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { generateAffiliateUrl } from '@/lib/affiliates';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id
    const supabase = await createClient();

    // Fetch prices with retailer info
    const { data: prices, error } = await supabase
        .from('prices')
        .select(`
      *,
      retailer:retailers(*)
    `)
        .eq('product_id', id)
        .order('price', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Generate dynamic affiliate URLs for each price
    const pricesWithAffiliateUrls = prices?.map(price => ({
        ...price,
        // Generate affiliate URL using retailer slug and product URL
        affiliate_url: generateAffiliateUrl(
            price.retailer.name,
            price.url,
            price.retailer.affiliate_network
        )
    })) || [];

    return NextResponse.json({ prices: pricesWithAffiliateUrls });
}
