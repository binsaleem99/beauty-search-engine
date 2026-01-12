import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Hero() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
            <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-6">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Find the Best <span className="text-primary">Beauty Deals</span> in Kuwait
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                    Search for products by name or ingredient. We compare prices from Noon, Amazon, Sephora, and more to find you the lowest price.
                </p>
                <div className="w-full max-w-lg space-y-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input className="pl-10 h-12 text-base shadow-sm rounded-full border-primary/20 focus-visible:ring-primary" placeholder="Search products (e.g., CeraVe, Vitamin C)..." type="search" />
                        <Button className="absolute right-1 top-1 h-10 rounded-full px-6" size="sm">Search</Button>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">Popular:</span>
                    <Button variant="outline" size="sm" className="h-7 rounded-full text-xs">Vitamin C</Button>
                    <Button variant="outline" size="sm" className="h-7 rounded-full text-xs">Retinol</Button>
                    <Button variant="outline" size="sm" className="h-7 rounded-full text-xs">CeraVe</Button>
                    <Button variant="outline" size="sm" className="h-7 rounded-full text-xs">The Ordinary</Button>
                </div>
            </div>
        </section>
    )
}
