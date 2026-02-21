"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/app/context/language-context";
import { DashboardOverview } from "@/components/dashboard-overview";

export default function DashboardPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-transparent">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <DashboardOverview />

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
