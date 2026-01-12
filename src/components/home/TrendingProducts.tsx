"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useEffect, useState } from "react"


export function TrendingProducts() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTrending() {
            try {
                const res = await fetch('/api/products?trending=true')
                const data = await res.json()
                if (data.products) {
                    setProducts(data.products)
                }
            } catch (error) {
                console.error("Failed to fetch trending products", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTrending()
    }, [])

    return (
        <section className="py-16">
            <div className="container">
                <h2 className="text-3xl font-bold mb-8">Trending Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-secondary/20 animate-pulse rounded-2xl" />
                        ))
                    ) : products.map((product) => (
                        <div key={product.id} className="group relative bg-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-border/50">
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
                                {/* Floating Badge */}
                                <div className="absolute top-3 start-3">
                                    <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/90 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
                                        Best Deal
                                    </span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-6">
                                <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">{product.brand}</div>
                                <h3 className="font-serif text-xl leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                                    {product.name_en}
                                </h3>

                                <div className="flex items-end justify-between border-t border-border/50 pt-4">
                                    <div>
                                        <div className="text-[10px] text-muted-foreground mb-0.5">Lowest Price</div>
                                        <div className="text-2xl font-bold text-foreground tracking-tight">
                                            {product.lowest_price ? `${product.lowest_price} KWD` : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="text-[10px] text-muted-foreground mb-0.5">Found at</div>
                                        <div className="text-sm font-medium">{product.retailer_name || 'Various'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Overlay Action */}
                            <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
