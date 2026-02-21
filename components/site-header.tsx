"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/app/context/profile-context";
import { useLanguage } from "@/app/context/language-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

import { cn } from "@/lib/utils";

const steps = [
    { name: "nav.myKhet", href: "/khet-details" },
    { name: "nav.recommendation", href: "/advisor" },
    { name: "nav.market", href: "/market" },
    { name: "nav.risk", href: "/risk-analysis" },
    { name: "nav.seasons", href: "/seasons" },
];

export function SiteHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { profile } = useProfile();
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4 mr-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary hover:bg-accent md:mr-2"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative w-10 h-10 overflow-hidden rounded-full">
                            <Image src="/logo.jpg" alt="Agrolytics Logo" fill className="object-cover" />
                        </div>
                        <span className="text-xl font-bold text-green-800 dark:text-green-400 tracking-tight hidden md:inline-block">Agrolytics</span>
                    </Link>
                </div>

                <nav className="flex items-center gap-4 md:gap-6 flex-1 justify-center">
                    {steps.map((step) => {
                        const isActive = pathname === step.href;
                        return (
                            <Link
                                key={step.href}
                                href={step.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-green-700 dark:hover:text-green-400 hover:bg-accent px-3 py-2 rounded-md",
                                    isActive ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-bold" : "text-muted-foreground"
                                )}
                            >
                                {t(step.name)}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-3">
                    <LanguageToggle />
                    <ThemeToggle />
                    {profile ? (
                        <Link href="/profile" className="flex items-center gap-2 transition-colors hover:text-green-700 dark:hover:text-green-400">
                            <span className="text-sm font-medium text-foreground/80 hidden md:block">{profile.name}</span>
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-green-100 dark:border-green-800">
                                <Image src="/farmer-animated.png" alt="Profile" fill className="object-cover" />
                            </div>
                        </Link>
                    ) : (
                        <Link href="/create-profile">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white">
                                {t("nav.createProfile")}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
