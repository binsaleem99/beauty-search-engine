"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useEffect, useState } from "react"

export function LanguageToggle() {
    const [lang, setLang] = useState("en")

    useEffect(() => {
        // Sync with html dir attribute
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
        document.documentElement.lang = lang
    }, [lang])

    const toggleLang = () => {
        setLang(current => current === "en" ? "ar" : "en")
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="font-medium"
        >
            <Globe className="me-2 h-4 w-4" />
            {lang === "en" ? "العربية" : "English"}
        </Button>
    )
}
