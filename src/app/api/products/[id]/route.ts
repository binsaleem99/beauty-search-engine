import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { generateAffiliateUrl } from '@/lib/affiliates';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id
    const supabase = await createClient();

    // Fetch product with prices and retailer info
    const { data: product, error } = await supabase
        .from('products')
        .select(`
      *,
      prices (
        *,
        retailer:retailers(*)
      )
    `)
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Generate dynamic affiliate URLs for each price
    if (product?.prices) {
        product.prices = product.prices.map((price: any) => ({
            ...price,
            affiliate_url: generateAffiliateUrl(
                price.retailer.slug,
                price.product_url,
                price.retailer.affiliate_network
            )
        }));
    }

    return NextResponse.json({ product });
}
