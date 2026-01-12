"use client"

import { useState, useEffect, use } from "react"
import { PaywallModal } from "@/components/premium/PaywallModal"

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function IngredientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params) // Assuming id is needed for fetching ingredient details later
    const [showPaywall, setShowPaywall] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkAccess() {
            try {
                const res = await fetch('/api/subscription/status')
                if (res.ok) {
                    const data = await res.json()
                    // If not premium, show paywall
                    if (data.status !== 'premium') {
                        setShowPaywall(true)
                    }
                } else {
                    // Not logged in or error -> show paywall
                    setShowPaywall(true)
                }
            } catch (error) {
                console.error(error)
                setShowPaywall(true)
            } finally {
                setLoading(false)
            }
        }
        checkAccess()
    }, [])

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="container mx-auto px-4 py-8 relative min-h-screen">
            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

            {/* Blurred Content Behind Paywall */}
            <div className={`transition-all duration-500 ${showPaywall ? 'blur-md pointer-events-none select-none overflow-hidden h-screen' : ''}`}>
                <h1 className="text-4xl font-bold mb-4">Vitamin C</h1>
                <p className="text-xl text-muted-foreground mb-8">Ascorbic Acid • L-Ascorbic Acid</p>

                <div className="grid gap-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Benefits</h2>
                        <p className="text-lg">Brightens skin tone, reduces dark spots, boosts collagen production, and protects against sun damage.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Top Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-secondary/30 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
