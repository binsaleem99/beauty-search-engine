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

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {loading ? (
                                Array(8).fill(0).map((_, i) => (
                                    <div key={i} className="aspect-[3/4] bg-secondary/20 animate-pulse rounded-2xl" />
                                ))
                            ) : (
                                results.map(product => ( // Changed 'products' to 'results'
                                    <Link href={`/product/${product.id}`} key={product.id} className="group relative bg-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-border/50 block">
                                        {/* Image Area */}
                                        <div className="aspect-square relative bg-secondary/5 overflow-hidden">
                                            {product.image_url ? (
                                                <Image
                                                    src={product.image_url}
                                                    alt={product.name_en}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/10 text-6xl font-black">
                                                    BEAUTY
                                                </div>
                                            )}
                                            {/* Retailer badge if available */}
                                            {product.retailer_name && (
                                                <div className="absolute top-3 start-3">
                                                    <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/90 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
                                                        {product.retailer_name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-6">
                                            <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">{product.brand}</div>
                                            <h3 className="font-serif text-xl leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                                                {product.name_en}
                                            </h3>

                                            <div className="flex items-end justify-between border-t border-border/50 pt-4">
                                                <div>
                                                    <div className="text-[10px] text-muted-foreground mb-0.5">Best Price</div>
                                                    <div className="text-xl font-bold text-foreground tracking-tight">
                                                        {product.lowest_price ? `${product.lowest_price} KWD` : 'N/A'}
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                                        <div className="i-lucide-arrow-right w-4 h-4" /> &rarr;
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Overlay Action */}
                                        <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                                    </Link>
                                ))
                            )}

                            {/* No Results Message */}
                            {!loading && results.length === 0 && (
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
