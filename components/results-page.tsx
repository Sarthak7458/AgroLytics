"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { CropCard } from "@/components/crop-card";
import { AIChatPanel } from "@/components/ai-chat-panel";
import { MixedStrategyCard } from "@/components/mixed-strategy-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RecommendationResponse } from "@/lib/api";
import { useLanguage } from "@/app/context/language-context";

interface FormData {
  location: string;
  season: "Kharif" | "Rabi" | "Zaid";
  landSize: number;
  irrigationType: "Rainfed" | "Irrigated";
}

interface ResultsPageProps {
  formData: FormData;
  results: RecommendationResponse;
  onStartOver: () => void;
}

export function ResultsPage({ formData, results, onStartOver }: ResultsPageProps) {
  const { t } = useLanguage();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [showMixedStrategy, setShowMixedStrategy] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  if (!results.recommended) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-2xl p-8 shadow-sm text-center border border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌱</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("results.noCropsFound") || "No Suitable Crops Found"}</h2>
          <p className="text-muted-foreground mb-6">
            {results.message || t("results.noCropsMsg") || "We couldn't find any crops matching your criteria for this season and land type."}
          </p>
          <Button onClick={onStartOver}>{t("results.tryAgain") || "Try Again"}</Button>
        </div>
      </div>
    );
  }

  // Map API response to Component format
  const recommendedCrop = {
    ...results.recommended,
    profit: results.recommended.expectedProfit,
    risk: results.recommended.riskProfile.level.toLowerCase() as "low" | "medium" | "high",
    factors: results.recommended.riskProfile.factors,
    isRecommended: true,
    confidence: results.recommended.confidence
  };

  const alternativeCrops = results.alternatives.map(alt => ({
    name: alt.name,
    profit: alt.expectedProfit,
    risk: alt.riskLevel ? alt.riskLevel.toLowerCase() as "low" | "medium" | "high" : "medium",
    explanation: `${alt.name} is a viable alternative for this season.`,
    factors: ["Alternative Option"],
    marketPrice: alt.marketPrice,
    marketTrend: alt.marketTrend,
    isRecommended: false,
    confidence: alt.confidence
  }));

  const allCrops = [recommendedCrop, ...alternativeCrops];
  const alternativeCrop = alternativeCrops[0];

  const handleWhyThisCrop = (cropName: string) => {
    setSelectedCrop(cropName);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Summary Card */}
        <div className="bg-card rounded-2xl p-6 mb-8 border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("results.yourFarmDetails") || "Your Farm Details"}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground px-3 py-1.5">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {formData.location === "Pune, Maharashtra" ? (t("location.pune_maharashtra") || formData.location) : formData.location}
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground px-3 py-1.5">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {t(`khet.${formData.season.toLowerCase()}`) || formData.season}
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground px-3 py-1.5">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
              {formData.landSize} {t("khet.acres") || "acres"}
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground px-3 py-1.5">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              {t(`khet.${formData.irrigationType.toLowerCase()}`) || formData.irrigationType}
            </Badge>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              {t("results.recommendedCrops") || "Recommended Crops"}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMixedStrategy(!showMixedStrategy)}
              className={cn("border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30", showMixedStrategy && "bg-green-50 dark:bg-green-950/30")}
            >
              {showMixedStrategy ? t("results.hideStrategy") || "Hide Strategy" : t("results.mixedStrategy") || "Mixed Strategy"}
            </Button>
          </div>

          {/* Mixed Strategy View */}
          {showMixedStrategy && recommendedCrop && alternativeCrop && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <MixedStrategyCard
                mainCrop={recommendedCrop}
                alternativeCrop={alternativeCrop}
                landSize={formData.landSize}
              />
            </div>
          )}

          {/* Crop Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allCrops.map((crop, index) => (
              <CropCard
                key={t(`crop.${crop.name.toLowerCase()}`) || crop.name}
                crop={crop}
                onWhyThisCrop={() => handleWhyThisCrop(crop.name)}
                isExpanded={expandedCard === crop.name}
                onToggle={() => setExpandedCard(expandedCard === crop.name ? null : crop.name)}
                delay={index * 150}
                landSize={formData.landSize}
              />
            ))}
          </div>
        </div>

        {/* Total Potential */}
        {recommendedCrop && (
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 animate-in fade-in duration-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("results.totalPotentialEarnings") || "Total Potential Earnings"}
                </p>
                <p className="text-2xl font-bold text-primary">
                  ₹
                  {(recommendedCrop.profit * formData.landSize).toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {recommendedCrop.name} cultivation on your{" "}
              {formData.landSize} acre farm
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Link href="/market">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white gap-2">
              {t("results.checkMarketTrends") || "Check Market Trends"} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>

      {/* AI Chat Panel */}
      <AIChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        cropName={selectedCrop}
        context={
          allCrops.find(c => c.name === selectedCrop)
            ? {
              profit: allCrops.find(c => c.name === selectedCrop)!.profit,
              risk: allCrops.find(c => c.name === selectedCrop)!.risk,
              season: formData.season
            }
            : { profit: 0, risk: "Low", season: formData.season }
        }
      />
    </div>
  );
}
