"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Bell, Heart, Share2, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState, use } from "react"
// import { useToast } from "@/hooks/use-toast"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    // const { toast } = useToast()
    const [product, setProduct] = useState<any>(null)
    const [prices, setPrices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                // Fetch details
                const prodRes = await fetch(`/api/products/${id}`)
                const prodData = await prodRes.json()

                // Fetch prices
                const priceRes = await fetch(`/api/products/${id}/prices`)
                const priceData = await priceRes.json()

                if (prodData.product) setProduct(prodData.product)
                if (priceData.prices) setPrices(priceData.prices)

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchProductData()
    }, [id])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/saved', {
                method: 'POST',
                body: JSON.stringify({ product_id: id }),
                headers: { 'Content-Type': 'application/json' }
            })

            if (!res.ok) {
                const data = await res.json()
                if (data.error && data.error.includes("limit")) {
                    alert("Free Limit Reached! Upgrade to Premium.")
                } else if (res.status === 401) {
                    window.location.href = "/login"
                }
            } else {
                alert("Product Saved!")
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
    if (!product) return <div className="p-10 text-center">Product not found</div>

    const lowestPrice = prices.length > 0 ? prices[0].price : 'N/A'
    const ingredientsList = product.main_ingredients || []

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Left: Image */}
                <div className="bg-secondary/20 rounded-xl flex items-center justify-center p-8 aspect-square md:aspect-auto">
                    {/* Placeholder */}
                    <div className="text-4xl text-muted-foreground/30 font-bold">{product.image_url ? <img src={product.image_url} alt="Product" className="max-h-96 object-contain" /> : 'Product Found'}</div>
                </div>

                {/* Right: Info */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg text-primary font-medium mb-1">{product.brand}</h2>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name_en}</h1>
                        <div className="flex gap-2">
                            {/* Mock Badges */}
                            <Badge variant="outline">Top Brand</Badge>
                            <Badge variant="secondary">{product.category}</Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-primary">{lowestPrice} KWD</span>
                        <span className="text-sm text-muted-foreground">{prices.length > 0 ? 'lowest price' : 'out of stock'}</span>
                    </div>

                    <div className="flex gap-3">
                        <Button className="flex-1" size="lg" disabled={prices.length === 0}>Find Best Deal</Button>
                        <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Heart className="h-5 w-5 " />}
                        </Button>
                        <Button variant="outline" size="icon" className="h-12 w-12"><Bell className="h-5 w-5" /></Button>
                        <Button variant="outline" size="icon" className="h-12 w-12"><Share2 className="h-5 w-5" /></Button>
                    </div>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Price Comparison</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Retailer</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead className="text-end">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prices.map((p, i) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">{p.retailer?.display_name_en || 'Store'}</TableCell>
                                            <TableCell>{p.price} KWD</TableCell>
                                            <TableCell className="text-end">
                                                <Button size="sm" variant={i === 0 ? "default" : "secondary"} asChild>
                                                    <a href={p.url} target="_blank" rel="noopener noreferrer">Buy</a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {prices.length === 0 && <TableRow><TableCell colSpan={3} className="text-center">No prices available</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h3 className="text-xl font-bold mb-4">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {product.description_en}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-4">Ingredients Analysis</h3>
                        <Alert className="mb-4 bg-primary/5 border-primary/20">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            <AlertTitle>Premium Feature</AlertTitle>
                            <AlertDescription>
                                Login to see detailed breakdown of every ingredient and its benefits.
                            </AlertDescription>
                        </Alert>

                        <div className="flex flex-wrap gap-2">
                            {ingredientsList.map((ing: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground">
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
