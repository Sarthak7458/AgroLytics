"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { useProfile } from "@/app/context/profile-context";
import { useLanguage } from "@/app/context/language-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

import { cn } from "@/lib/utils";

const steps = [
    { name: "Dashboard", href: "/dashboard", isTranslationKey: false },
    { name: "nav.myKhet", href: "/khet-details", isTranslationKey: true },
    { name: "nav.recommendation", href: "/advisor", isTranslationKey: true },
    { name: "nav.market", href: "/market", isTranslationKey: true },
    { name: "nav.risk", href: "/risk-analysis", isTranslationKey: true },
    { name: "nav.seasons", href: "/seasons", isTranslationKey: true },
];

export function SiteHeader() {
    const pathname = usePathname();
    const { profile } = useProfile();
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4 mr-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-foreground hover:text-green-700 hover:bg-accent md:mr-2"
                            >
                                <Menu className="w-6 h-6" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <SheetDescription className="sr-only">Main navigation for the application.</SheetDescription>
                            <nav className="flex flex-col gap-4 mt-8">
                                {steps.map((step) => {
                                    const isActive = pathname === step.href;
                                    return (
                                        <Link
                                            key={step.href}
                                            href={step.href}
                                            className={cn(
                                                "text-lg font-medium transition-colors hover:text-green-700 dark:hover:text-green-400 hover:bg-accent px-4 py-3 rounded-md",
                                                isActive ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-bold" : "text-foreground"
                                            )}
                                        >
                                            {step.isTranslationKey ? t(step.name) : step.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative w-10 h-10 overflow-hidden rounded-full">
                            <Image src="/logo.jpg" alt="Agrolytics Logo" fill className="object-cover" />
                        </div>
                        <span className="text-xl font-bold text-green-800 dark:text-green-400 tracking-tight hidden md:inline-block">Agrolytics</span>
                    </Link>
                </div>

                <div className="flex flex-1"></div>


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
