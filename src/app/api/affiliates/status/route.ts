import { NextResponse } from 'next/server';
import { validateAffiliateConfig } from '@/lib/affiliates';

/**
 * Affiliate Configuration Status Endpoint
 * GET /api/affiliates/status
 *
 * Returns configuration status for affiliate networks.
 * Useful for deployment health checks.
 */
export async function GET() {
    const config = validateAffiliateConfig();

    return NextResponse.json({
        status: config.missing.length === 0 ? 'ready' : 'incomplete',
        ...config,
        message: config.missing.length === 0
            ? 'All affiliate credentials configured'
            : `Missing credentials: ${config.missing.join(', ')}`
    });
}
