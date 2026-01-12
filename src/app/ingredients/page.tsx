import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const INGREDIENTS = [
    { name: "Vitamin C", count: 47, desc: "Brightens skin & reduces dark spots" },
    { name: "Retinol", count: 32, desc: "Anti-aging & acne treatment" },
    { name: "Hyaluronic Acid", count: 56, desc: "Deep hydration & plumping" },
    { name: "Niacinamide", count: 41, desc: "Controls oil & minimizes pores" },
    { name: "Salicylic Acid", count: 28, desc: "Exfoliates & clears acne" },
    { name: "Glycolic Acid", count: 19, desc: "Smoothes texture & brightens" },
    { name: "Azelaic Acid", count: 15, desc: "Reduces redness & rosacea" },
    { name: "Benzoyl Peroxide", count: 22, desc: "Kills acne-causing bacteria" },
    { name: "Ceramides", count: 64, desc: "Restores skin barrier" },
    { name: "Peptides", count: 38, desc: "Stimulates collagen" },
]

export default function IngredientsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center mb-12 space-y-4">
                <h1 className="text-3xl font-bold">Ingredient Library</h1>
                <p className="text-muted-foreground">Browse our database of active ingredients to understand what they do and find products that contain them.</p>

                <div className="relative max-w-lg mx-auto">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9 bg-secondary/50" placeholder="Search ingredients (e.g., Vitamin C)..." />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INGREDIENTS.map((ing) => (
                    <Card key={ing.name} className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">{ing.name}</CardTitle>
                                <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full">{ing.count}</span>
                            </div>
                            <CardDescription>{ing.desc}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}
