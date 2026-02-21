"use client";

import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { ResultsPage } from "@/components/results-page";

import { api, RecommendationResponse } from "@/lib/api";
import { useLanguage } from "@/app/context/language-context";
import { supabase } from "@/lib/supabase";

type AppState = "history" | "input" | "loading" | "results" | "error";

interface FormData {
  location: string;
  season: "Kharif" | "Rabi" | "Zaid";
  landSize: number;
  irrigationType: "Rainfed" | "Irrigated";
}

export default function AdvisorPage() {
  const [appState, setAppState] = useState<AppState>("loading");
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData | null>({
    location: "Pune, Maharashtra",
    season: "Kharif",
    landSize: 5,
    irrigationType: "Irrigated",
  });
  const [results, setResults] = useState<RecommendationResponse | null>(null);

  // Fetch from localStorage on mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Minimum loading time for UX
        const minLoadTime = new Promise((resolve) => setTimeout(resolve, 3000));

        // Default data
        let data: FormData = {
          location: "Pune, Maharashtra",
          season: "Kharif",
          landSize: 5,
          irrigationType: "Irrigated"
        };

        const savedData = localStorage.getItem("khetDetails");
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            data = {
              location: parsed.location,
              season: parsed.season as "Kharif" | "Rabi" | "Zaid",
              landSize: parsed.landSize,
              irrigationType: parsed.irrigationType as "Rainfed" | "Irrigated"
            };
            setFormData(data);
          } catch (e) {
            console.error("Failed to parse saved khet details", e);
          }
        }

        const apiCall = api.getRecommendation(data);

        const [response] = await Promise.all([apiCall, minLoadTime]);
        setResults(response);
        setAppState("results");

        // Save recommendation to Supabase
        await saveRecommendationToSupabase(response, data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setAppState("error");
      }
    };

    fetchRecommendations();
  }, []);

  // Save the top recommendation to Supabase `recommendations` table
  const saveRecommendationToSupabase = async (
    response: RecommendationResponse,
    data: FormData
  ) => {
    try {
      const profileStr = localStorage.getItem("userProfile");
      const farmId = localStorage.getItem("currentFarmId");

      if (!profileStr) {
        return;
      }

      const profile = JSON.parse(profileStr);
      if (!profile.id || !farmId) {
        return;
      }

      const crop = response.recommended;
      if (!crop) {
        return;
      }

      const { error } = await supabase
        .from("recommendations")
        .insert({
          farmer_id: profile.id,
          farm_id: farmId,
          recommended_crop: crop.name,
          final_score: crop.finalScore,
          expected_profit: crop.expectedProfit,
          risk_level: crop.riskProfile?.level || "Medium",
          confidence: crop.confidence,
          season_used: data.season,
          demand_trend: crop.marketTrend || null,
          profit_score: crop.demandScore || null,
        });

      if (error) {
        console.error("Supabase recommendation save error:", error.message, "Code:", error.code, "Details:", error.details);
      } else {
        console.log("Recommendation saved to Supabase");
      }
    } catch (err) {
      console.error("Error saving recommendation:", err);
    }
  };

  const handleStartOver = () => {
    // In the linear workflow, start over might mean going back to Khet Details or just re-running
    window.location.href = "/khet-details";
  };

  return (
    <main className="min-h-screen pb-8">


      {appState === "loading" && (
        <LoadingScreen />
      )}

      {appState === "results" && formData && results && (
        <ResultsPage
          formData={formData}
          results={results}
          onStartOver={handleStartOver}
        />
      )}

      {appState === "error" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-destructive">{t("advisor.connectionIssue") || "Connection Issue"}</h2>
            <p className="text-muted-foreground">{t("advisor.error")}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-full hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              {t("advisor.tryAgain")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
