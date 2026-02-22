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


                </div>
            </main>
        </div>
    );
}
