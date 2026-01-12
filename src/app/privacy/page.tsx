import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Beauty Search',
    description: 'Privacy policy for Beauty Search Engine - how we collect, use, and protect your personal information'
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 md:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Privacy Policy
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                    Last updated: January 12, 2026
                </p>

                <div className="prose prose-gray max-w-none space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            1. Introduction
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to Beauty Search Engine. We respect your privacy and are committed to protecting your
                            personal data. This privacy policy explains how we collect, use, store, and protect your information
                            when you use our website and services.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            By using our service, you agree to the collection and use of information in accordance with this policy.
                        </p>
                    </section>

                    {/* Data Collection */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            2. Information We Collect
                        </h2>

                        <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Personal Information</h3>
                        <p className="text-gray-700 leading-relaxed">
                            When you create an account, we collect:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Email address (required for account creation and login)</li>
                            <li>Name (optional, for personalization)</li>
                            <li>Password (encrypted and never stored in plain text)</li>
                            <li>Country preference (Kuwait, UAE, Saudi Arabia)</li>
                            <li>Language preference (English or Arabic)</li>
                        </ul>

                        <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">2.2 Usage Data</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We automatically collect certain information when you use our service:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Search queries and search history</li>
                            <li>Products you save to your favorites</li>
                            <li>Price alerts you set up</li>
                            <li>Pages visited and features used</li>
                            <li>Device information (browser type, operating system)</li>
                            <li>IP address and approximate location</li>
                        </ul>

                        <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">2.3 Payment Information</h3>
                        <p className="text-gray-700 leading-relaxed">
                            When you subscribe to Premium, we use Tap Payments to process transactions. We do not store
                            your credit card details. Tap Payments stores and processes your payment information securely
                            according to PCI DSS standards.
                        </p>
                    </section>

                    {/* Data Usage */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            3. How We Use Your Information
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use your personal information for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li><strong>Account Management:</strong> To create and manage your account</li>
                            <li><strong>Service Delivery:</strong> To provide price comparisons, product searches, and personalized recommendations</li>
                            <li><strong>Price Alerts:</strong> To monitor prices and send notifications when products drop below your target price</li>
                            <li><strong>Payment Processing:</strong> To process subscription payments and provide premium features</li>
                            <li><strong>Communication:</strong> To send important service updates, security alerts, and price notifications</li>
                            <li><strong>Analytics:</strong> To understand how users interact with our service and improve functionality</li>
                            <li><strong>Customer Support:</strong> To respond to your inquiries and provide assistance</li>
                            <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                        </ul>
                    </section>

                    {/* Third-Party Services */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            4. Third-Party Services
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use the following third-party services to operate our platform:
                        </p>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900">Supabase (Database & Authentication)</h4>
                                <p className="text-gray-700 text-sm mt-1">
                                    Stores user accounts, saved products, and preferences. View their privacy policy at{' '}
                                    <a href="https://supabase.com/privacy" className="text-blue-600 hover:underline">
                                        supabase.com/privacy
                                    </a>
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900">Tap Payments (Payment Processing)</h4>
                                <p className="text-gray-700 text-sm mt-1">
                                    Processes subscription payments securely. View their privacy policy at{' '}
                                    <a href="https://www.tap.company/privacy" className="text-blue-600 hover:underline">
                                        tap.company/privacy
                                    </a>
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900">Vercel (Hosting)</h4>
                                <p className="text-gray-700 text-sm mt-1">
                                    Hosts our website and processes requests. View their privacy policy at{' '}
                                    <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline">
                                        vercel.com/legal/privacy-policy
                                    </a>
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900">Affiliate Networks</h4>
                                <p className="text-gray-700 text-sm mt-1">
                                    When you click buy links, we may receive a commission from retailers (Noon, Amazon, Faces, etc.)
                                    through affiliate networks like ArabClicks and Amazon Associates. This does not affect the
                                    price you pay.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Cookies */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            5. Cookies and Tracking
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use cookies and similar tracking technologies to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Keep you logged in to your account</li>
                            <li>Remember your language preference</li>
                            <li>Analyze site usage and improve performance</li>
                            <li>Track affiliate referrals</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            You can control cookies through your browser settings. However, disabling cookies may affect
                            your ability to use certain features of our service.
                        </p>
                    </section>

                    {/* Data Security */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            6. Data Security
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We implement industry-standard security measures to protect your personal information:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Data encryption in transit (HTTPS/TLS)</li>
                            <li>Encrypted storage of passwords using bcrypt</li>
                            <li>Secure authentication using Supabase Auth</li>
                            <li>Regular security audits and updates</li>
                            <li>Restricted access to personal data</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            While we take reasonable steps to protect your information, no method of transmission over
                            the internet is 100% secure. We cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* User Rights */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            7. Your Rights
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            You have the following rights regarding your personal data:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
                            <li><strong>Export:</strong> Download your data in a portable format</li>
                            <li><strong>Opt-out:</strong> Unsubscribe from marketing emails (service emails may still be sent)</li>
                            <li><strong>Object:</strong> Object to certain data processing activities</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            To exercise any of these rights, please contact us at{' '}
                            <a href="mailto:privacy@yourdomain.com" className="text-blue-600 hover:underline">
                                privacy@yourdomain.com
                            </a>
                        </p>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            8. Data Retention
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We retain your personal data for as long as necessary to provide our services and comply
                            with legal obligations:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Account data: Until you delete your account</li>
                            <li>Search history: 12 months</li>
                            <li>Price alerts: Until cancelled or account deleted</li>
                            <li>Payment records: As required by law (typically 5-7 years)</li>
                        </ul>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            9. Children's Privacy
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Our service is not intended for users under 18 years of age. We do not knowingly collect
                            personal information from children. If you believe we have collected information from a
                            child, please contact us immediately.
                        </p>
                    </section>

                    {/* Changes */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            10. Changes to This Policy
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this privacy policy from time to time. We will notify you of significant
                            changes by email or through a notice on our website. Your continued use of the service
                            after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            11. Contact Us
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have questions about this privacy policy or our data practices, please contact us:
                        </p>
                        <div className="bg-gray-50 p-6 rounded-lg mt-4">
                            <p className="text-gray-900 font-semibold mb-2">Beauty Search Engine</p>
                            <p className="text-gray-700">Email: <a href="mailto:privacy@yourdomain.com" className="text-blue-600 hover:underline">privacy@yourdomain.com</a></p>
                            <p className="text-gray-700">Location: Kuwait</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
