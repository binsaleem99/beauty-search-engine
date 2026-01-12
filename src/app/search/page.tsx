"use client"

import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"

function SearchContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''

    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true)
            try {
                // If query is empty, maybe fetch recent or random? For now just return empty or catch all
                const endpoint = query
                    ? `/api/search/product?q=${encodeURIComponent(query)}`
                    : `/api/products?limit=12` // Fallback to some products

                const res = await fetch(endpoint)
                const data = await res.json()
                if (data.products) {
                    setResults(data.products)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [query])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 space-y-6">
                    <div>
                        <h3 className="font-semibold mb-3">Filters</h3>
                        <Separator className="mb-4" />

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                                {/* Placeholder for Price Slider/Inputs */}
                                <div className="flex items-center gap-2">
                                    <Input type="number" placeholder="Min" className="h-8 text-sm" />
                                    <span className="me-2 text-muted-foreground">-</span>
                                    <Input type="number" placeholder="Max" className="h-8 text-sm" />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-2">Brand</h4>
                                <div className="space-y-2">
                                    {['CeraVe', 'The Ordinary', 'Vichy', 'La Roche-Posay'].map(brand => (
                                        <div key={brand} className="flex items-center gap-2">
                                            <input type="checkbox" id={brand} className="rounded border-gray-300" />
                                            <label htmlFor={brand} className="text-sm">{brand}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-2">Skin Type</h4>
                                <div className="space-y-2">
                                    {['Dry', 'Oily', 'Sensitive', 'Combination'].map(type => (
                                        <div key={type} className="flex items-center gap-2">
                                            <input type="checkbox" id={type} className="rounded border-gray-300" />
                                            <label htmlFor={type} className="text-sm">{type}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Results Grid */}
                <main className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Results for "{query || 'All Products'}"</h1>
                        <div className="text-sm text-muted-foreground">Showing {results.length} results</div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((product) => (
                                <Link href={`/product/${product.id}`} key={product.id}>
                                    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                                        <div className="aspect-square bg-secondary/20 relative flex items-center justify-center">
                                            {/* Image placeholder or real image if available */}
                                            <span className="text-muted-foreground/30 font-bold">Product Img</span>
                                        </div>
                                        <CardHeader className="p-4 pb-2">
                                            <div className="text-xs text-muted-foreground mb-1">{product.brand}</div>
                                            <CardTitle className="text-base line-clamp-2">{product.name_en}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 py-2">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-primary">View Prices</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
                                            <span>Compare retailers</span>
                                            <Button size="sm" variant="outline" className="h-8">View &rarr;</Button>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                            {results.length === 0 && (
                                <div className="col-span-full text-center py-20 text-muted-foreground">
                                    No products found matching your criteria.
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin" size={32} />
            </div>
        }>
            <SearchContent />
        </Suspense>
    )
}
