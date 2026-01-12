import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | Beauty Search',
    description: 'Terms of service for Beauty Search Engine - rules and guidelines for using our platform'
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 md:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Terms of Service
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                    Last updated: January 12, 2026
                </p>

                <div className="prose prose-gray max-w-none space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to Beauty Search Engine. By accessing or using our website and services, you agree to be
                            bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of
                            these terms, you may not use our service.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            We reserve the right to modify these terms at any time. We will notify users of material changes
                            via email or through the website. Your continued use after changes constitutes acceptance of the
                            new terms.
                        </p>
                    </section>

                    {/* Service Description */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            2. Service Description
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Beauty Search Engine is a price comparison platform for beauty and skincare products available
                            in Kuwait, UAE, and Saudi Arabia. Our services include:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Product price comparison across multiple retailers (Noon, Amazon.ae, Faces, Sephora, etc.)</li>
                            <li>Product search by name or brand</li>
                            <li>Ingredient database and search (Premium feature)</li>
                            <li>Save favorite products</li>
                            <li>Price drop alerts (Premium feature)</li>
                            <li>Price history tracking</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            We do not sell products directly. We provide information and links to retailers where you can
                            purchase products.
                        </p>
                    </section>

                    {/* Account Registration */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            3. Account Registration
                        </h2>

                        <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Eligibility</h3>
                        <p className="text-gray-700 leading-relaxed">
                            You must be at least 18 years old to create an account and use our service. By registering,
                            you represent that you meet this age requirement.
                        </p>

                        <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">3.2 Account Security</h3>
                        <p className="text-gray-700 leading-relaxed">
                            You are responsible for:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Maintaining the confidentiality of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us immediately of any unauthorized access</li>
                            <li>Ensuring your email address is valid and up-to-date</li>
                        </ul>

                        <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">3.3 Account Termination</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to suspend or terminate your account if you:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Violate these terms of service</li>
                            <li>Provide false or misleading information</li>
                            <li>Engage in fraudulent or illegal activities</li>
                            <li>Attempt to scrape, abuse, or disrupt our service</li>
                        </ul>
                    </section>

                    {/* Subscription Plans */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            4. Subscription Plans
                        </h2>

                        <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Free Plan</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Free accounts include:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Product price comparison</li>
                            <li>Search products by name</li>
                            <li>Save up to 5 products</li>
                        </ul>

                        <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">4.2 Premium Plan</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Premium subscription includes all free features plus:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Unlimited saved products</li>
                            <li>Search products by ingredients</li>
                            <li>Price drop alerts via email</li>
                            <li>Priority customer support</li>
                        </ul>

                        <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">4.3 Pricing</h3>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Monthly: 5 KWD/month</li>
                            <li>Annual: 40 KWD/year (save 33%)</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Prices are subject to change with 30 days notice to existing subscribers.
                        </p>

                        <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">4.4 Payment</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Payments are processed securely through Tap Payments. We accept major credit cards and
                            local payment methods. All charges are in Kuwaiti Dinars (KWD).
                        </p>

                        <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">4.5 Automatic Renewal</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Premium subscriptions automatically renew at the end of each billing period unless cancelled.
                            You will be charged the then-current subscription rate.
                        </p>

                        <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">4.6 Cancellation</h3>
                        <p className="text-gray-700 leading-relaxed">
                            You may cancel your subscription at any time through your account settings. Upon cancellation:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>You will retain Premium access until the end of your current billing period</li>
                            <li>No refunds will be provided for partial months</li>
                            <li>Your account will automatically downgrade to Free plan</li>
                            <li>Saved products beyond the free limit will be hidden (but not deleted)</li>
                        </ul>

                        <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">4.7 Refund Policy</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We offer a 7-day money-back guarantee for first-time Premium subscribers. After 7 days,
                            subscriptions are non-refundable. To request a refund, contact support@yourdomain.com.
                        </p>
                    </section>

                    {/* User Content */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            5. User Conduct
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            When using our service, you agree NOT to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Use automated tools (bots, scrapers) to access or collect data</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the service</li>
                            <li>Reverse engineer or decompile any part of the service</li>
                            <li>Use the service for illegal purposes</li>
                            <li>Share your account credentials with others</li>
                            <li>Create multiple accounts to bypass free tier limits</li>
                            <li>Submit false or misleading information</li>
                        </ul>
                    </section>

                    {/* Accuracy */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            6. Price Accuracy and Availability
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            While we strive to provide accurate and up-to-date pricing information:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Prices are fetched from retailer websites and may be delayed</li>
                            <li>We cannot guarantee real-time accuracy</li>
                            <li>Product availability may change without notice</li>
                            <li>Retailers may apply additional fees (shipping, taxes) at checkout</li>
                            <li>Final prices are determined by the retailer, not by Beauty Search</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            <strong>Always verify prices and availability on the retailer's website before purchasing.</strong>
                        </p>
                    </section>

                    {/* Affiliate Disclosure */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            7. Affiliate Relationships
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We participate in affiliate programs with retailers including Noon, Amazon.ae, Faces, and others.
                            When you click on product links and make purchases, we may earn a commission at no additional
                            cost to you.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            These commissions help us maintain and improve our service. Our recommendations and price
                            comparisons remain objective regardless of commission rates.
                        </p>
                    </section>

                    {/* Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            8. Intellectual Property
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            All content on Beauty Search Engine, including text, graphics, logos, and software, is owned
                            by or licensed to us and is protected by copyright, trademark, and other intellectual property laws.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            You may not copy, reproduce, distribute, or create derivative works without our express
                            written permission.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Product images, names, and descriptions are the property of their respective brands and retailers.
                        </p>
                    </section>

                    {/* Disclaimers */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            9. Disclaimers and Limitations
                        </h2>

                        <h3 className="text-xl font-medium text-gray-800 mb-3">9.1 Service "As Is"</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Our service is provided "as is" and "as available" without warranties of any kind, either
                            express or implied. We do not guarantee that the service will be uninterrupted, error-free,
                            or completely secure.
                        </p>

                        <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">9.2 Medical Advice Disclaimer</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Information about ingredients and their benefits is for educational purposes only and should
                            not be considered medical advice. Always consult with a dermatologist or healthcare professional
                            before using new skincare products, especially if you have skin conditions or allergies.
                        </p>

                        <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">9.3 No Liability</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We are not responsible for:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                            <li>Product quality, safety, or suitability</li>
                            <li>Transactions between you and retailers</li>
                            <li>Shipping delays or damaged products</li>
                            <li>Adverse reactions to products</li>
                            <li>Retailer customer service issues</li>
                            <li>Price errors or discrepancies</li>
                        </ul>
                    </section>

                    {/* Liability Limitation */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            10. Limitation of Liability
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            To the maximum extent permitted by law, Beauty Search Engine and its affiliates shall not be
                            liable for any indirect, incidental, special, consequential, or punitive damages arising from
                            your use of the service.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Our total liability for any claims shall not exceed the amount you paid us in the 12 months
                            prior to the claim (or 5 KWD if you're a free user).
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            11. Governing Law
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            These terms are governed by the laws of Kuwait. Any disputes shall be resolved in the courts
                            of Kuwait.
                        </p>
                    </section>

                    {/* Changes */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            12. Changes to Terms
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update these terms from time to time. Material changes will be communicated via email
                            or through a prominent notice on the website at least 30 days before taking effect.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Continued use of the service after changes indicates acceptance of the new terms.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            13. Contact Information
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            For questions about these Terms of Service, please contact us:
                        </p>
                        <div className="bg-gray-50 p-6 rounded-lg mt-4">
                            <p className="text-gray-900 font-semibold mb-2">Beauty Search Engine</p>
                            <p className="text-gray-700">Support: <a href="mailto:support@yourdomain.com" className="text-blue-600 hover:underline">support@yourdomain.com</a></p>
                            <p className="text-gray-700">Legal: <a href="mailto:legal@yourdomain.com" className="text-blue-600 hover:underline">legal@yourdomain.com</a></p>
                            <p className="text-gray-700">Location: Kuwait</p>
                        </div>
                    </section>

                    {/* Severability */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            14. Severability
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            If any provision of these terms is found to be invalid or unenforceable, the remaining
                            provisions will continue in full force and effect.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
