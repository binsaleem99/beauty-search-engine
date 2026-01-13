"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Hero() {
    const router = useRouter()
    const [query, setQuery] = useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-background">
            {/* Abstract Background Elements for Visual Tension */}
            <div className="absolute top-[-20%] start-[-10%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] end-[-5%] w-[40vw] h-[40vw] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center">

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards opacity-0" style={{ animationDelay: '0ms' }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary mb-8 backdrop-blur-sm hover:bg-secondary/80 transition-colors cursor-default">
                        <Sparkles className="w-3 h-3 text-primary animate-spin-slow" />
                        <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">The Future of Beauty Search</span>
                    </div>
                </div>

                <h1
                    className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards opacity-0 text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60 leading-[1.1]"
                    style={{ animationDelay: '150ms' }}
                >
                    Beauty <br className="md:hidden" /> Decoded.
                </h1>

                <p
                    className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards opacity-0 max-w-[700px] text-lg md:text-2xl text-muted-foreground mb-12"
                    style={{ animationDelay: '300ms' }}
                >
                    Instant price comparison and ingredient analysis for the modern GCC consumer. Don't just buy—invest in your skin sensibly.
                </p>

                <div
                    className="animate-in fade-in zoom-in-95 duration-1000 fill-mode-forwards opacity-0 w-full max-w-2xl"
                    style={{ animationDelay: '450ms' }}
                >
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center bg-background border-2 border-primary/10 group-hover:border-primary/30 rounded-full shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">
                            <Search className="absolute start-6 w-6 h-6 text-muted-foreground" />
                            <Input
                                className="h-16 ps-16 pe-32 text-lg border-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50 rounded-full"
                                placeholder="Search 'CeraVe' or 'Hyaluronic Acid'..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="absolute end-2">
                                <Button size="lg" type="submit" className="rounded-full px-8 h-12 text-base font-bold shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-rose-500/25 transition-all hover:scale-105">
                                    Search
                                </Button>
                            </div>
                        </div>
                    </form>
                    <div className="mt-6 flex flex-wrap gap-3 justify-center text-sm text-muted-foreground">
                        <span className="py-1">Popular:</span>
                        {['Vitamin C', 'Sunscreen', 'Retinol', 'Moisturizer'].map((term) => (
                            <button
                                key={term}
                                onClick={() => setQuery(term)}
                                className="px-3 py-1 rounded-full bg-secondary/30 hover:bg-secondary hover:text-primary transition-colors text-xs font-medium"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
