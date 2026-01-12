import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const timestamp = new Date().toISOString();

    try {
        // Parse webhook body
        const body = await request.json();

        // Log all webhook events for debugging
        console.log('[WEBHOOK RECEIVED]', {
            timestamp,
            status: body.status,
            charge_id: body.id,
            amount: body.amount,
            currency: body.currency,
            metadata: body.metadata,
            customer: body.customer?.email
        });

        const status = body.status;
        const metadata = body.metadata;

        // Only process CAPTURED charges
        if (status !== 'CAPTURED') {
            console.log('[WEBHOOK IGNORED] Non-captured status:', status);
            return NextResponse.json({ received: true }, { status: 200 });
        }

        // Validate subscription payment metadata
        if (metadata?.type !== 'subscription_payment') {
            console.log('[WEBHOOK IGNORED] Not a subscription payment:', metadata?.type);
            return NextResponse.json({ received: true }, { status: 200 });
        }

        if (!metadata?.user_id) {
            console.error('[WEBHOOK ERROR] Missing user_id in metadata:', metadata);
            return NextResponse.json({ received: true, error: 'Missing user_id' }, { status: 200 });
        }

        const userId = metadata.user_id;
        const plan = metadata.plan || 'monthly';
        const chargeId = body.id;
        const amount = body.amount;

        console.log('[WEBHOOK PROCESSING]', {
            userId,
            plan,
            chargeId,
            amount
        });

        // Calculate subscription end date
        const startDate = new Date();
        const endDate = new Date(startDate);

        if (plan === 'annual') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            endDate.setMonth(endDate.getMonth() + 1);
        }

        // Use service role client for webhook (no user session)
        const serviceRoleSupabase = await createServiceRoleClient();

        // Update user subscription status
        const { data, error } = await serviceRoleSupabase
            .from('users')
            .update({
                subscription_status: 'premium',
                subscription_ends_at: endDate.toISOString(),
                subscription_id: chargeId,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select();

        if (error) {
            console.error('[WEBHOOK ERROR] Database update failed:', {
                userId,
                error: error.message,
                details: error.details,
                hint: error.hint
            });
            return NextResponse.json({
                received: true,
                error: 'Database update failed'
            }, { status: 500 });
        }

        if (!data || data.length === 0) {
            console.error('[WEBHOOK ERROR] User not found:', userId);
            return NextResponse.json({
                received: true,
                error: 'User not found'
            }, { status: 500 });
        }

        console.log('[WEBHOOK SUCCESS]', {
            userId,
            plan,
            chargeId,
            subscription_ends_at: endDate.toISOString(),
            updated_user: data[0]
        });

        // Return 200 immediately to acknowledge webhook receipt
        return NextResponse.json({
            received: true,
            updated: true,
            user_id: userId,
            subscription_ends_at: endDate.toISOString()
        }, { status: 200 });

    } catch (error) {
        // Log unexpected errors
        console.error('[WEBHOOK EXCEPTION]', {
            timestamp,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });

        // Always return 200 to prevent webhook retries on parsing errors
        return NextResponse.json({
            received: true,
            error: 'Internal processing error'
        }, { status: 200 });
    }
}

// Helper to create Admin Client
import { createClient as createClientPrimitive } from '@supabase/supabase-js'

async function createServiceRoleClient() {
    return createClientPrimitive(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                persistSession: false
            }
        }
    )
}
