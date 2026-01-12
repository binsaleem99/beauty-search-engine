import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const INGREDIENTS = [
    { name: "Vitamin C", count: 47, desc: "Brightens skin & reduces dark spots" },
    { name: "Retinol", count: 32, desc: "Anti-aging & acne treatment" },
    { name: "Hyaluronic Acid", count: 56, desc: "Deep hydration & plumping" },
    { name: "Niacinamide", count: 41, desc: "Controls oil & minimizes pores" },
    { name: "Salicylic Acid", count: 28, desc: "Exfoliates & clears acne" },
    { name: "Glycolic Acid", count: 19, desc: "Smoothes texture & brightens" }
]

export function PopularIngredients() {
    return (
        <section className="w-full py-12 md:py-16 bg-secondary/20">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">Popular Ingredients</h2>
                    <Button variant="ghost" className="text-primary">View All &rarr;</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {INGREDIENTS.map((ing) => (
                        <Card key={ing.name} className="hover:border-primary/50 transition-colors cursor-pointer">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{ing.name}</CardTitle>
                                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">{ing.count} products</span>
                                </div>
                                <CardDescription>{ing.desc}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
