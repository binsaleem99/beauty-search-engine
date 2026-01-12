import { NextResponse } from 'next/server';
import { createClient as createClientPrimitive } from '@supabase/supabase-js';

/**
 * Cron Job: Update Product Prices
 * Scheduled: Daily at midnight UTC (0 0 * * *)
 *
 * This endpoint:
 * 1. Fetches all products with current prices
 * 2. Checks for price changes (placeholder - web scraping needed)
 * 3. Updates prices table if changed
 * 4. Records changes to price_history
 * 5. Checks price_alerts and flags any triggered alerts
 *
 * Protected by CRON_SECRET environment variable
 */
export async function GET(request: Request) {
    const startTime = Date.now();

    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
        console.error('[CRON] CRON_SECRET not configured');
        return NextResponse.json({
            error: 'Cron secret not configured'
        }, { status: 500 });
    }

    // Check authorization header
    if (authHeader !== `Bearer ${cronSecret}`) {
        console.error('[CRON] Unauthorized request');
        return NextResponse.json({
            error: 'Unauthorized'
        }, { status: 401 });
    }

    console.log('[CRON] Starting price update job...');

    // Create service role client (no user session in cron)
    const supabase = createClientPrimitive(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                persistSession: false
            }
        }
    );

    try {
        // Fetch all prices with product and retailer info
        const { data: prices, error: fetchError } = await supabase
            .from('prices')
            .select(`
                *,
                product:products(*),
                retailer:retailers(*)
            `)
            .order('last_checked', { ascending: true }); // Check oldest first

        if (fetchError) {
            console.error('[CRON] Error fetching prices:', fetchError);
            return NextResponse.json({
                error: 'Failed to fetch prices'
            }, { status: 500 });
        }

        console.log(`[CRON] Found ${prices?.length || 0} prices to check`);

        let updatedCount = 0;
        let errorCount = 0;
        const priceChanges: any[] = [];

        // Check each price
        for (const price of prices || []) {
            try {
                // TODO: Implement actual price fetching
                // For now, this is a placeholder that simulates price checking
                const newPrice = await checkRetailerPrice(price);

                // Update last_checked timestamp
                await supabase
                    .from('prices')
                    .update({
                        last_checked: new Date().toISOString()
                    })
                    .eq('id', price.id);

                // If price changed, update and log
                if (newPrice && newPrice !== price.price) {
                    console.log(`[CRON] Price changed for ${price.product.name_en}:`, {
                        retailer: price.retailer.name_en,
                        old: price.price,
                        new: newPrice
                    });

                    // Update price
                    await supabase
                        .from('prices')
                        .update({
                            price: newPrice,
                            last_checked: new Date().toISOString()
                        })
                        .eq('id', price.id);

                    // Log to price history
                    await supabase
                        .from('price_history')
                        .insert({
                            price_id: price.id,
                            price: newPrice
                        });

                    priceChanges.push({
                        product: price.product.name_en,
                        retailer: price.retailer.name_en,
                        old_price: price.price,
                        new_price: newPrice,
                        change_percentage: ((newPrice - price.price) / price.price * 100).toFixed(2)
                    });

                    updatedCount++;

                    // Check price alerts for this product
                    await checkPriceAlerts(supabase, price.product_id, price.retailer_id, newPrice);
                }
            } catch (error) {
                console.error(`[CRON] Error checking price ${price.id}:`, error);
                errorCount++;
            }
        }

        const duration = Date.now() - startTime;

        console.log('[CRON] Price update job completed:', {
            duration_ms: duration,
            total_checked: prices?.length || 0,
            prices_updated: updatedCount,
            errors: errorCount,
            price_changes: priceChanges
        });

        return NextResponse.json({
            success: true,
            duration_ms: duration,
            total_checked: prices?.length || 0,
            prices_updated: updatedCount,
            errors: errorCount,
            price_changes: priceChanges
        });
    } catch (error) {
        console.error('[CRON] Exception in price update job:', error);
        return NextResponse.json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

/**
 * Check retailer for current price
 * TODO: Implement actual web scraping or API calls per retailer
 *
 * @param price - Price record with product and retailer info
 * @returns New price or null if unchanged/unavailable
 */
async function checkRetailerPrice(price: any): Promise<number | null> {
    // PLACEHOLDER: This needs real implementation
    // For now, randomly simulate price changes for testing

    const retailerSlug = price.retailer.slug;
    const productUrl = price.product_url;

    console.log(`[CRON] Checking price for ${price.product.name_en} at ${retailerSlug}`);

    // TODO: Implement per-retailer scraping logic
    switch (retailerSlug) {
        case 'noon':
            // return await scrapeNoonPrice(productUrl);
            break;
        case 'amazon-ae':
            // return await scrapeAmazonPrice(productUrl);
            break;
        case 'faces':
            // return await scrapeFacesPrice(productUrl);
            break;
        case 'sephora':
            // return await scrapeSephoraPrice(productUrl);
            break;
    }

    // Placeholder: Simulate random price changes (10% of items)
    if (Math.random() < 0.1) {
        const change = (Math.random() - 0.5) * 0.2; // ±10% change
        return Math.round((price.price * (1 + change)) * 1000) / 1000;
    }

    return null; // No change
}

/**
 * Check if any price alerts should be triggered
 *
 * @param supabase - Supabase client
 * @param productId - Product ID
 * @param retailerId - Retailer ID
 * @param newPrice - New price
 */
async function checkPriceAlerts(
    supabase: any,
    productId: string,
    retailerId: string,
    newPrice: number
) {
    // Fetch active alerts for this product at this retailer
    const { data: alerts, error } = await supabase
        .from('price_alerts')
        .select(`
            *,
            user:users(*)
        `)
        .eq('product_id', productId)
        .eq('retailer_id', retailerId)
        .eq('is_active', true)
        .lte('target_price', newPrice); // Alert triggers when price drops below target

    if (error) {
        console.error('[CRON] Error fetching price alerts:', error);
        return;
    }

    if (!alerts || alerts.length === 0) {
        return;
    }

    console.log(`[CRON] Found ${alerts.length} price alerts triggered`);

    // Mark alerts as triggered (deactivate and set timestamp)
    for (const alert of alerts) {
        await supabase
            .from('price_alerts')
            .update({
                is_active: false,
                triggered_at: new Date().toISOString()
            })
            .eq('id', alert.id);

        console.log(`[CRON] Alert triggered for user ${alert.user.email}:`, {
            target: alert.target_price,
            actual: newPrice,
            savings: alert.target_price - newPrice
        });

        // Send email notification
        try {
            const { sendPriceAlertEmail } = await import('@/lib/email');

            // Fetch product and retailer details
            const { data: product } = await supabase
                .from('products')
                .select('name_en, image_url')
                .eq('id', productId)
                .single();

            const { data: retailer } = await supabase
                .from('retailers')
                .select('name_en')
                .eq('id', retailerId)
                .single();

            // Get product URL for buy link
            const { data: price } = await supabase
                .from('prices')
                .select('product_url')
                .eq('product_id', productId)
                .eq('retailer_id', retailerId)
                .single();

            if (product && retailer && price) {
                await sendPriceAlertEmail({
                    userEmail: alert.user.email,
                    productName: product.name_en,
                    productImage: product.image_url,
                    oldPrice: alert.target_price,
                    newPrice: newPrice,
                    retailerName: retailer.name_en,
                    retailerUrl: price.product_url
                });

                console.log(`[CRON] Email sent to ${alert.user.email}`);
            }
        } catch (emailError) {
            console.error('[CRON] Error sending email:', emailError);
            // Don't fail the cron job if email fails
        }
    }
}
