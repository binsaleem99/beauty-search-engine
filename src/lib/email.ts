import { Resend } from 'resend';

/**
 * Email Service using Resend
 * Handles transactional emails for price alerts, receipts, etc.
 */

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const EMAIL_CONFIG = {
    from: 'Beauty Search <notifications@yourdomain.com>', // Change to your verified domain
    replyTo: 'support@yourdomain.com' // Change to your support email
};

/**
 * Send price alert email to user
 *
 * @param userEmail - Recipient email address
 * @param productName - Name of the product
 * @param productImage - Product image URL
 * @param oldPrice - Previous price (target price)
 * @param newPrice - New (discounted) price
 * @param currency - Currency code (default: KWD)
 * @param retailerName - Retailer name
 * @param retailerUrl - Buy link with affiliate tracking
 * @returns Resend response or error
 */
export async function sendPriceAlertEmail({
    userEmail,
    productName,
    productImage,
    oldPrice,
    newPrice,
    currency = 'KWD',
    retailerName,
    retailerUrl
}: {
    userEmail: string;
    productName: string;
    productImage?: string;
    oldPrice: number;
    newPrice: number;
    currency?: string;
    retailerName: string;
    retailerUrl: string;
}) {
    const savings = oldPrice - newPrice;
    const savingsPercentage = ((savings / oldPrice) * 100).toFixed(0);

    try {
        const { data, error } = await resend.emails.send({
            from: EMAIL_CONFIG.from,
            to: userEmail,
            replyTo: EMAIL_CONFIG.replyTo,
            subject: `🎉 Price Drop Alert: ${productName}`,
            html: generatePriceAlertHTML({
                productName,
                productImage,
                oldPrice,
                newPrice,
                savings,
                savingsPercentage,
                currency,
                retailerName,
                retailerUrl
            })
        });

        if (error) {
            console.error('[EMAIL] Error sending price alert:', error);
            return { success: false, error };
        }

        console.log('[EMAIL] Price alert sent successfully:', {
            to: userEmail,
            product: productName,
            messageId: data?.id
        });

        return { success: true, data };
    } catch (error) {
        console.error('[EMAIL] Exception sending price alert:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Generate HTML email template for price alerts
 */
function generatePriceAlertHTML({
    productName,
    productImage,
    oldPrice,
    newPrice,
    savings,
    savingsPercentage,
    currency,
    retailerName,
    retailerUrl
}: {
    productName: string;
    productImage?: string;
    oldPrice: number;
    newPrice: number;
    savings: number;
    savingsPercentage: string;
    currency: string;
    retailerName: string;
    retailerUrl: string;
}) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Price Drop Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                🎉 Price Drop Alert!
                            </h1>
                            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                                The product you're watching just got cheaper
                            </p>
                        </td>
                    </tr>

                    <!-- Product Info -->
                    <tr>
                        <td style="padding: 40px;">
                            ${productImage ? `
                            <div style="text-align: center; margin-bottom: 30px;">
                                <img src="${productImage}" alt="${productName}" style="max-width: 200px; height: auto; border-radius: 8px; border: 1px solid #e5e5e5;" />
                            </div>
                            ` : ''}

                            <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 22px; font-weight: 600; text-align: center;">
                                ${productName}
                            </h2>

                            <!-- Price Comparison -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                                        <table role="presentation" style="width: 100%;">
                                            <tr>
                                                <td style="width: 50%; text-align: center; padding-right: 10px; border-right: 2px solid #e5e5e5;">
                                                    <div style="color: #999; font-size: 14px; margin-bottom: 8px;">Previous Price</div>
                                                    <div style="color: #666; font-size: 24px; font-weight: 600; text-decoration: line-through;">
                                                        ${oldPrice.toFixed(3)} ${currency}
                                                    </div>
                                                </td>
                                                <td style="width: 50%; text-align: center; padding-left: 10px;">
                                                    <div style="color: #999; font-size: 14px; margin-bottom: 8px;">New Price</div>
                                                    <div style="color: #10b981; font-size: 32px; font-weight: 700;">
                                                        ${newPrice.toFixed(3)} ${currency}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Savings Badge -->
                            <div style="text-align: center; margin: 30px 0;">
                                <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; border-radius: 50px; font-size: 20px; font-weight: 700;">
                                    Save ${savings.toFixed(3)} ${currency} (${savingsPercentage}% OFF)
                                </div>
                            </div>

                            <!-- Retailer Info -->
                            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                                    Available at
                                </p>
                                <p style="margin: 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                                    ${retailerName}
                                </p>
                            </div>

                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${retailerUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                                    Buy Now
                                </a>
                            </div>

                            <p style="margin: 30px 0 0; color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.6;">
                                This is an automated price alert. Prices may change at any time.
                                <br>
                                Act fast before the deal expires!
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px;">
                                You're receiving this email because you set up a price alert for this product.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                Beauty Search Engine | Kuwait
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

/**
 * Send welcome email to new users
 *
 * @param userEmail - User's email address
 * @param userName - User's name
 */
export async function sendWelcomeEmail(userEmail: string, userName?: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: EMAIL_CONFIG.from,
            to: userEmail,
            replyTo: EMAIL_CONFIG.replyTo,
            subject: 'Welcome to Beauty Search!',
            html: `
                <h1>Welcome ${userName ? userName : ''}!</h1>
                <p>Thank you for joining Beauty Search. Start saving on your favorite beauty products today.</p>
                <p>As a free user, you can:</p>
                <ul>
                    <li>Compare prices across 4+ retailers</li>
                    <li>Save up to 5 favorite products</li>
                    <li>Search for products by name</li>
                </ul>
                <p>Upgrade to Premium for unlimited saves, ingredient search, and price alerts!</p>
                <a href="https://yourdomain.com">Get Started</a>
            `
        });

        if (error) {
            console.error('[EMAIL] Error sending welcome email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('[EMAIL] Exception sending welcome email:', error);
        return { success: false, error };
    }
}

/**
 * Send subscription receipt email
 *
 * @param userEmail - User's email address
 * @param plan - Subscription plan (monthly/annual)
 * @param amount - Amount paid
 * @param currency - Currency code
 */
export async function sendSubscriptionReceipt(
    userEmail: string,
    plan: string,
    amount: number,
    currency: string = 'KWD'
) {
    try {
        const { data, error } = await resend.emails.send({
            from: EMAIL_CONFIG.from,
            to: userEmail,
            replyTo: EMAIL_CONFIG.replyTo,
            subject: 'Payment Confirmed - Beauty Search Premium',
            html: `
                <h1>Payment Confirmed!</h1>
                <p>Thank you for subscribing to Beauty Search Premium.</p>
                <h2>Receipt</h2>
                <p><strong>Plan:</strong> ${plan === 'annual' ? 'Annual' : 'Monthly'}</p>
                <p><strong>Amount:</strong> ${amount.toFixed(3)} ${currency}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <h3>Your Premium Benefits:</h3>
                <ul>
                    <li>Unlimited saved products</li>
                    <li>Search products by ingredients</li>
                    <li>Price drop alerts</li>
                    <li>Priority support</li>
                </ul>
                <a href="https://yourdomain.com">Start Using Premium Features</a>
            `
        });

        if (error) {
            console.error('[EMAIL] Error sending receipt:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('[EMAIL] Exception sending receipt:', error);
        return { success: false, error };
    }
}
