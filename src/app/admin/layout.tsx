import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering for admin area
export const dynamic = 'force-dynamic';

/**
 * Admin Layout - Protected Area
 * Only accessible by users whose email matches ADMIN_EMAIL env var
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login?redirectTo=/admin/products');
    }

    // Check if user is admin
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || user.email !== adminEmail) {
        // Not authorized - redirect to home
        redirect('/?error=unauthorized');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold text-gray-900">
                                Admin Dashboard
                            </h1>
                            <span className="text-sm text-gray-500">
                                {user.email}
                            </span>
                        </div>
                        <nav className="flex gap-4">
                            <a
                                href="/admin/products"
                                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                Products
                            </a>
                            <a
                                href="/"
                                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                Back to Site
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Admin Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
