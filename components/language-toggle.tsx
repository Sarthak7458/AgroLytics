"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/app/context/language-context"

export function LanguageToggle() {
    const { locale, setLocale } = useLanguage()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => setMounted(true), [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="sm" className="h-9 px-2 text-muted-foreground gap-1.5">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-semibold">EN</span>
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2 text-muted-foreground hover:text-foreground hover:bg-accent gap-1.5"
            onClick={() => setLocale(locale === "en" ? "hi" : "en")}
            title={locale === "en" ? "हिंदी में बदलें" : "Switch to English"}
        >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-semibold">{locale === "en" ? "EN" : "हि"}</span>
        </Button>
    )
}
