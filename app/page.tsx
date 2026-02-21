"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sprout, TrendingUp, ShieldCheck, Sun } from "lucide-react";
import { useProfile } from "./context/profile-context";
import { useLanguage } from "./context/language-context";

export default function LandingPage() {
  const { profile } = useProfile();
  const { t } = useLanguage();
  const features = [
    {
      icon: <Sprout className="w-8 h-8 text-green-600 dark:text-green-400" />,
      title: t("landing.feature1Title"),
      desc: t("landing.feature1Desc")
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: t("landing.feature2Title"),
      desc: t("landing.feature2Desc")
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
      title: t("landing.feature3Title"),
      desc: t("landing.feature3Desc")
    },
    {
      icon: <Sun className="w-8 h-8 text-orange-500 dark:text-orange-400" />,
      title: t("landing.feature4Title"),
      desc: t("landing.feature4Desc")
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 via-background to-green-50 dark:from-green-950/30 dark:via-background dark:to-green-950/30 overflow-hidden relative font-sans">

      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-green-800 dark:text-green-400" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Hero Section */}
      <div className="z-10 flex-grow flex flex-col items-center justify-center container mx-auto px-4 py-12 md:py-20 lg:py-24">

        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-12 md:gap-24">

          {/* Left Content */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-green-950 dark:text-green-50 tracking-tight leading-none mb-4">
                {t("landing.title1")} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-400">
                  {t("landing.title2")}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-lg mx-auto md:mx-0">
                {t("landing.subtitle")} <br />
                <span className="text-lg text-muted-foreground font-normal mt-2 block">
                  {t("landing.description")}
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-center pt-4"
            >
              <Link href={profile ? "/khet-details" : "/create-profile"}>
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500 shadow-xl shadow-green-200 dark:shadow-green-900/30 hover:shadow-2xl transition-all scale-100 hover:scale-105 text-white">
                  {profile ? t("landing.ctaAnalysis") : t("landing.ctaProfile")}
                </Button>
              </Link>

            </motion.div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center md:justify-end relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-72 h-72 md:w-96 md:h-96"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-green-200 to-yellow-100 dark:from-green-800 dark:to-yellow-900/50 rounded-full blur-3xl opacity-60 animate-pulse" />
              <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-4 border-background shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/farmer-animated.png"
                  alt="Happy Farmer"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border border-green-100 dark:border-green-800 z-20 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase">{t("landing.yieldPrediction")}</p>
                  <p className="text-lg font-bold text-green-900 dark:text-green-300">{t("landing.yieldGrowth")}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-card/80 backdrop-blur-sm border-t border-green-100 dark:border-green-800 py-16 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-green-50/50 dark:bg-green-950/30 p-6 rounded-2xl hover:bg-green-100/50 dark:hover:bg-green-900/40 hover:shadow-md transition-all cursor-default border border-transparent hover:border-green-200 dark:hover:border-green-700"
              >
                <div className="mb-4 bg-card w-14 h-14 rounded-full flex items-center justify-center shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}
