/**
 * Affiliate URL Generation System
 *
 * Generates tracked affiliate links for supported retailers.
 * Requires environment variables for affiliate credentials.
 */

// Affiliate network configuration
export const AFFILIATE_NETWORKS = {
    ARABCLICKS: 'arabclicks',
    AMAZON_ASSOCIATES: 'amazon_associates',
    DIRECT: 'direct'
} as const;

// Retailer-specific offer IDs (for ArabClicks)
export const RETAILER_OFFERS = {
    NOON: 'noon',
    FACES: 'faces',
    NAMSHI: 'namshi'
} as const;

// Environment variable keys
const ENV = {
    ARABCLICKS_PID: process.env.ARABCLICKS_PID || '',
    AMAZON_ASSOCIATE_TAG: process.env.AMAZON_ASSOCIATE_TAG || '',
    NOON_OFFER_ID: process.env.NOON_OFFER_ID || '',
    FACES_OFFER_ID: process.env.FACES_OFFER_ID || '',
} as const;

/**
 * Generate ArabClicks affiliate URL
 * Used for: Noon, Faces, Namshi
 *
 * @param productUrl - Direct product URL from retailer
 * @param offerType - Retailer type (noon, faces, etc.)
 * @returns Tracked affiliate URL or original URL if credentials missing
 */
export function generateArabClicksUrl(
    productUrl: string,
    offerType: 'noon' | 'faces' | 'namshi'
): string {
    const publisherId = ENV.ARABCLICKS_PID;

    // Map offer types to environment variable keys
    const offerIdMap = {
        noon: ENV.NOON_OFFER_ID,
        faces: ENV.FACES_OFFER_ID,
        namshi: '', // Add when available
    };

    const offerId = offerIdMap[offerType];

    // Return original URL if credentials not configured
    if (!publisherId || !offerId) {
        console.warn(`[AFFILIATES] Missing ArabClicks credentials for ${offerType}. Using direct URL.`);
        return productUrl;
    }

    // Construct ArabClicks tracking URL
    const baseUrl = 'https://track.arabclicks.com/click';
    const params = new URLSearchParams({
        pid: publisherId,
        offer_id: offerId,
        url: productUrl
    });

    return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate Amazon Associates affiliate URL
 * Used for: Amazon.ae
 *
 * @param productUrl - Direct Amazon product URL
 * @returns Tracked affiliate URL with associate tag
 */
export function generateAmazonUrl(productUrl: string): string {
    const associateTag = ENV.AMAZON_ASSOCIATE_TAG;

    // Return original URL if tag not configured
    if (!associateTag) {
        console.warn('[AFFILIATES] Missing Amazon Associate Tag. Using direct URL.');
        return productUrl;
    }

    try {
        const url = new URL(productUrl);

        // Add or replace tag parameter
        url.searchParams.set('tag', associateTag);

        return url.toString();
    } catch (error) {
        console.error('[AFFILIATES] Invalid Amazon URL:', productUrl);
        return productUrl;
    }
}

/**
 * Generate direct retailer URL (no affiliate)
 * Used for: Sephora ME (no program), or fallback
 *
 * @param productUrl - Direct product URL
 * @returns Original URL unchanged
 */
export function generateDirectUrl(productUrl: string): string {
    return productUrl;
}

/**
 * Main affiliate URL generator
 * Routes to appropriate network handler based on retailer
 *
 * @param retailerSlug - Retailer identifier (noon, amazon-ae, faces, etc.)
 * @param productUrl - Direct product URL from retailer
 * @param affiliateNetwork - Network type (arabclicks, amazon_associates, direct)
 * @returns Affiliate-tracked URL or direct URL
 */
export function generateAffiliateUrl(
    retailerSlug: string,
    productUrl: string,
    affiliateNetwork?: string
): string {
    // Normalize retailer slug
    const slug = retailerSlug.toLowerCase();

    // Route based on retailer and network
    switch (slug) {
        case 'noon':
            return generateArabClicksUrl(productUrl, 'noon');

        case 'faces':
        case 'faces-middle-east':
            return generateArabClicksUrl(productUrl, 'faces');

        case 'namshi':
            return generateArabClicksUrl(productUrl, 'namshi');

        case 'amazon-ae':
        case 'amazon':
            return generateAmazonUrl(productUrl);

        case 'sephora':
        case 'sephora-me':
        default:
            return generateDirectUrl(productUrl);
    }
}

/**
 * Validate affiliate configuration
 * Useful for deployment health checks
 *
 * @returns Object with missing credentials
 */
export function validateAffiliateConfig() {
    return {
        arabclicks_configured: !!ENV.ARABCLICKS_PID,
        amazon_configured: !!ENV.AMAZON_ASSOCIATE_TAG,
        noon_offer_configured: !!ENV.NOON_OFFER_ID,
        faces_offer_configured: !!ENV.FACES_OFFER_ID,
        missing: [
            !ENV.ARABCLICKS_PID && 'ARABCLICKS_PID',
            !ENV.AMAZON_ASSOCIATE_TAG && 'AMAZON_ASSOCIATE_TAG',
            !ENV.NOON_OFFER_ID && 'NOON_OFFER_ID',
            !ENV.FACES_OFFER_ID && 'FACES_OFFER_ID',
        ].filter(Boolean)
    };
}

/**
 * Get commission rate for retailer
 * These are typical rates - update based on actual agreements
 *
 * @param retailerSlug - Retailer identifier
 * @returns Commission percentage (e.g., 8.5 for 8.5%)
 */
export function getCommissionRate(retailerSlug: string): number {
    const rates: Record<string, number> = {
        'noon': 8.0,
        'amazon-ae': 3.0,
        'faces': 10.0,
        'namshi': 8.0,
        'sephora': 0, // No affiliate program
    };

    return rates[retailerSlug.toLowerCase()] || 0;
}
