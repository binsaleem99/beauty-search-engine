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
                            <div key={i} className="aspect-square bg-secondary/20 animate-pulse rounded-lg" />
                        ))
                    ) : products.map((product) => (
                        <Card key={product.id} className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                            <div className="aspect-square relative bg-secondary/20 group-hover:scale-105 transition-transform duration-300">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name_en}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-4xl font-bold">
                                        IMG
                                    </div>
                                )}
                                <Badge className="absolute top-2 start-2 bg-green-500 hover:bg-green-600">Best Deal</Badge>
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <div className="text-xs text-muted-foreground mb-1">{product.brand}</div>
                                <CardTitle className="text-base line-clamp-1">{product.name_en}</CardTitle>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                                <div className="font-bold text-lg text-primary">{product.lowest_price ? `${product.lowest_price} KWD` : 'N/A'}</div>
                                <div className="text-xs text-muted-foreground">{product.retailer_name ? `via ${product.retailer_name}` : ''}</div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
