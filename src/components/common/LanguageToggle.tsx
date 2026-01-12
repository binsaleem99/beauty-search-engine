"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useRouter } from "next/navigation"

export function LanguageToggle() {
    const router = useRouter()

    const toggleLang = () => {
        const currentLang = document.documentElement.lang
        const newLang = currentLang === "en" ? "ar" : "en"

        // Set cookie
        document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`

        // Update document immediately for speed
        document.documentElement.lang = newLang
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr"

        // Refresh server components
        router.refresh()
    }

    // Determine current visual state (simpler to just check prop or cookie in real app, but this works for button text)
    // We'll rely on server render for initial state, but for client button text:
    const isArabic = typeof document !== 'undefined' && document.documentElement.lang === 'ar';

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="font-medium"
        >
            <Globe className="me-2 h-4 w-4" />
            {isArabic ? "English" : "العربية"}
        </Button>
    )
}
