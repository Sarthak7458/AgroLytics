"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { translations } from "@/lib/translations";

export type Locale = "en" | "hi";

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("appLanguage") as Locale | null;
        if (stored && (stored === "en" || stored === "hi")) {
            setLocaleState(stored);
        }
        setMounted(true);
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("appLanguage", newLocale);
    }, []);

    const t = useCallback((key: string): string => {
        const dict = translations[locale];
        return dict[key] || translations["en"][key] || key;
    }, [locale]);

    // Prevent hydration mismatch by rendering children with default locale until mounted
    const contextValue = {
        locale: mounted ? locale : "en" as Locale,
        setLocale,
        t: mounted ? t : (key: string) => translations["en"][key] || key,
    };

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
