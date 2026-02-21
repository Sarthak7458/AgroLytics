"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    User,
    Sprout,
    Tractor,
    TrendingUp,
    AlertTriangle,
    Calendar,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/context/language-context";

const dashboardKeys = [
    {
        titleKey: "dashboard.myProfile",
        descKey: "dashboard.myProfileDesc",
        icon: User,
        href: "/profile",
        color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
        delay: 0.1
    },
    {
        titleKey: "dashboard.myKhet",
        descKey: "dashboard.myKhetDesc",
        icon: Tractor,
        href: "/khet-details",
        color: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400",
        delay: 0.2
    },
    {
        titleKey: "dashboard.recommendation",
        descKey: "dashboard.recommendationDesc",
        icon: Sprout,
        href: "/advisor",
        color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
        delay: 0.3
    },
    {
        titleKey: "dashboard.marketTrends",
        descKey: "dashboard.marketTrendsDesc",
        icon: TrendingUp,
        href: "/market",
        color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400",
        delay: 0.4
    },
    {
        titleKey: "dashboard.riskAnalysis",
        descKey: "dashboard.riskAnalysisDesc",
        icon: AlertTriangle,
        href: "/risk-analysis",
        color: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
        delay: 0.5
    },
    {
        titleKey: "dashboard.seasonalGuide",
        descKey: "dashboard.seasonalGuideDesc",
        icon: Calendar,
        href: "/seasons",
        color: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
        delay: 0.6
    }
];

export default function DashboardPage() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background">

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-extrabold text-green-900 dark:text-green-100 mb-4 tracking-tight">
                            {t("dashboard.title")}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
                            {t("dashboard.subtitle")}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dashboardKeys.map((item, index) => (
                            <Link href={item.href} key={item.titleKey}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: item.delay }}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-border transition-all duration-300 h-full flex flex-col items-start relative overflow-hidden group"
                                >
                                    <div className={`p-4 rounded-xl mb-4 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon className="w-8 h-8" />
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-foreground mb-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                        {t(item.titleKey)}
                                    </h2>
                                    <p className="text-gray-500 dark:text-muted-foreground mb-6 flex-grow">
                                        {t(item.descKey)}
                                    </p>

                                    <div className="mt-auto flex items-center text-sm font-semibold text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                        {t("dashboard.goTo")} {t(item.titleKey)} <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>

                                    {/* Decorative gradient blob */}
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-green-50 dark:from-green-900/20 to-transparent rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-16 text-center"
                    >
                        <p className="text-sm text-gray-400 dark:text-muted-foreground">
                            {t("dashboard.footer")}
                        </p>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
