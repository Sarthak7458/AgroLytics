"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/context/language-context";

interface CropCardProps {
  crop: {
    name: string;
    profit: number; // Keep this as per-acre for reference if needed, or just specific crop data
    totalProfit?: number; // New optional prop for total calculation
    risk: "low" | "medium" | "high";
    explanation: string;
    factors: string[];
    isRecommended?: boolean;
    marketPrice?: number;
    marketTrend?: "up" | "down" | "stable";
    confidence?: "High" | "Medium" | "Low";
  };
  landSize?: number; // New prop
  onWhyThisCrop: () => void;
  isExpanded: boolean;
  onToggle: () => void;
  delay?: number;
}

export function CropCard({ crop, landSize = 1, onWhyThisCrop, isExpanded, onToggle, delay = 0 }: CropCardProps) {
  // Removed local isExpanded state
  const { t } = useLanguage();
  const [displayedProfit, setDisplayedProfit] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Use totalProfit if available, otherwise default to per-acre profit * landSize (or just profit if landSize is 1)
  const targetProfit = crop.totalProfit || (crop.profit * landSize);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 60;
    const stepValue = targetProfit / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += stepValue;
      if (current >= targetProfit) {
        setDisplayedProfit(targetProfit);
        clearInterval(interval);
      } else {
        setDisplayedProfit(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [targetProfit, isVisible]);

  const riskConfig = {
    low: { color: "bg-success text-primary-foreground", label: t("risk.low") || "Low Risk" },
    medium: { color: "bg-warning text-foreground", label: t("risk.medium") || "Medium Risk" },
    high: { color: "bg-danger text-primary-foreground", label: t("risk.high") || "High Risk" },
  };

  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    if (trend === "up") return <span className="text-green-600 dark:text-green-400">▲</span>;
    if (trend === "down") return <span className="text-red-500 dark:text-red-400">▼</span>;
    return <span className="text-muted-foreground">−</span>;
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-500 ease-out hover:shadow-lg border-2",
        crop.isRecommended
          ? "border-primary shadow-md"
          : "border-transparent hover:border-primary/30",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      )}
      onClick={onToggle}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{t(`crop.${crop.name.toLowerCase()}`) || crop.name}</h3>
              {crop.isRecommended && (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mt-1">
                  {t("results.recommended")}
                </Badge>
              )}
            </div>
          </div>
          <Badge className={riskConfig[crop.risk].color}>
            {riskConfig[crop.risk].label}
          </Badge>
        </div>

        <div className="mb-4 space-y-2">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {t("results.expectedProfit")} <span className="text-xs font-normal">({landSize} {t("khet.acres")})</span>
            </p>
            <p className="text-3xl font-bold text-primary">
              ₹{displayedProfit.toLocaleString("en-IN")}
            </p>
          </div>

          {crop.marketPrice && (
            <div className="flex items-center justify-between bg-muted/30 p-2 rounded text-sm">
              <span className="text-muted-foreground">{t("results.marketPrice")}:</span>
              <span className="font-semibold flex items-center gap-1">
                ₹{crop.marketPrice.toLocaleString("en-IN")}/qt
                {getTrendIcon(crop.marketTrend)}
              </span>
            </div>
          )}

          {crop.confidence && (
            <div className="flex items-center justify-between bg-muted/30 p-2 rounded text-sm">
              <span className="text-muted-foreground">{t("results.aiConfidence")}:</span>
              <Badge variant="outline" className={cn(
                crop.confidence === "High" ? "border-green-500 text-green-600" :
                  crop.confidence === "Medium" ? "border-yellow-500 text-yellow-600" :
                    "border-red-500 text-red-600"
              )}>
                {crop.confidence}
              </Badge>
            </div>
          )}
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-out",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="pt-4 border-t border-border">
            <p className="text-muted-foreground mb-4">{crop.explanation}</p>
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium text-foreground">{t("results.keyFactors")}</p>
              <div className="flex flex-wrap gap-2">
                {crop.factors.map((factor, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground"
                  >
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onWhyThisCrop();
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {t("results.whyThisCrop")}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center mt-4 text-muted-foreground">
          <span className="text-xs">
            {isExpanded ? t("results.clickToCollapse") : t("results.clickToExpand")}
          </span>
          <svg
            className={cn(
              "w-4 h-4 ml-1 transition-transform duration-300",
              isExpanded ? "rotate-180" : ""
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
