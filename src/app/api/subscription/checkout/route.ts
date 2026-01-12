import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body; // 'monthly' or 'annual'

    const amount = plan === 'annual' ? 40 : 5;
    const currency = 'KWD';

    // Basic validation
    if (!['monthly', 'annual'].includes(plan)) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const TAP_SECRET_KEY = process.env.TAP_SECRET_KEY;
    if (!TAP_SECRET_KEY) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Determine redirect URL (base URL + callback)
    // In dev: http://localhost:3000, In prod: https://your-domain.com
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const redirectUrl = `${origin}/settings?payment=success`; // Simple redirect for now

    try {
        const response = await fetch('https://api.tap.company/v2/charges', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TAP_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                currency: currency,
                customer: {
                    first_name: user.user_metadata?.name || 'Customer',
                    email: user.email,
                    phone: {
                        country_code: "965",
                        number: "00000000" // Optional or collect from user
                    }
                },
                source: {
                    id: "src_all"
                },
                redirect: {
                    url: redirectUrl
                },
                metadata: {
                    user_id: user.id,
                    plan: plan,
                    type: 'subscription_payment'
                }
            })
        });

        const tapData = await response.json();

        if (!response.ok) {
            console.error('Tap API Error:', tapData);
            return NextResponse.json({ error: tapData.errors?.[0]?.description || 'Payment initialization failed' }, { status: 500 });
        }

        // tapData.transaction.url is where we redirect the user
        return NextResponse.json({ checkout_url: tapData.transaction.url });

    } catch (error: any) {
        console.error('Checkout Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
