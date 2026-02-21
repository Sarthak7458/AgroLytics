"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressIndicator } from "@/components/progress-indicator";

interface FormData {
  location: string;
  season: "Kharif" | "Rabi" | "Zaid";
  landSize: number;
  irrigationType: "Rainfed" | "Irrigated";
}

interface InputFormProps {
  onSubmit: (data: FormData) => void;
}

export function InputForm({ onSubmit }: InputFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    location: "",
    season: getDefaultSeason(),
    landSize: 1,
    irrigationType: "Rainfed",
  });
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  function getDefaultSeason(): "Kharif" | "Rabi" | "Zaid" {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 9) return "Kharif";
    if (month >= 10 || month <= 2) return "Rabi";
    return "Zaid";
  }

  const handleNext = () => {
    if (step < 2) {
      setDirection("forward");
      setStep(step + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection("backward");
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 0:
        return formData.location.trim().length > 0;
      case 1:
        return formData.season !== null;
      case 2:
        return formData.landSize > 0 && formData.irrigationType !== null;
      default:
        return false;
    }
  };

  const seasons = [
    { value: "Kharif", label: "Kharif", desc: "Jun - Sep (Monsoon)" },
    { value: "Rabi", label: "Rabi", desc: "Oct - Mar (Winter)" },
    { value: "Zaid", label: "Zaid", desc: "Mar - Jun (Summer)" },
  ] as const;

  const irrigationTypes = [
    {
      value: "Rainfed",
      label: "Rainfed",
      desc: "Depends on rainfall",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
    {
      value: "Irrigated",
      label: "Irrigated",
      desc: "Canal, tubewell, drip",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
          Farmer Crop Advisor
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto text-pretty">
          Get personalized crop recommendations based on your farm conditions
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="w-full max-w-md mb-8">
        <ProgressIndicator currentStep={step} totalSteps={3} />
      </div>

      {/* Form Card */}
      <Card className="w-full max-w-md shadow-lg border-0 bg-card">
        <CardContent className="p-6 md:p-8">
          <div className="relative overflow-hidden">
            {/* Step 1: Location */}
            <div
              className={cn(
                "transition-all duration-500 ease-out",
                step === 0
                  ? "opacity-100 translate-x-0"
                  : direction === "forward"
                  ? "opacity-0 -translate-x-full absolute inset-0"
                  : "opacity-0 translate-x-full absolute inset-0"
              )}
            >
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Where is your farm located?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your village, district, or state
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location" className="text-foreground">
                    Farm Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Nashik, Maharashtra"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="mt-2 h-12 text-base bg-input border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Season */}
            <div
              className={cn(
                "transition-all duration-500 ease-out",
                step === 1
                  ? "opacity-100 translate-x-0"
                  : step > 1
                  ? "opacity-0 -translate-x-full absolute inset-0"
                  : "opacity-0 translate-x-full absolute inset-0"
              )}
            >
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Which season are you planning for?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                We&apos;ve selected the current season for you
              </p>
              <div className="grid grid-cols-1 gap-3">
                {seasons.map((season) => (
                  <button
                    key={season.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, season: season.value })
                    }
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all duration-300",
                      formData.season === season.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-card"
                    )}
                  >
                    <p className="font-medium text-foreground">{season.label}</p>
                    <p className="text-sm text-muted-foreground">{season.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Farm Details */}
            <div
              className={cn(
                "transition-all duration-500 ease-out",
                step === 2
                  ? "opacity-100 translate-x-0"
                  : step > 2
                  ? "opacity-0 -translate-x-full absolute inset-0"
                  : "opacity-0 translate-x-full absolute inset-0"
              )}
            >
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Tell us about your farm
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                This helps us give better recommendations
              </p>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="landSize" className="text-foreground">
                    Land Size (acres)
                  </Label>
                  <Input
                    id="landSize"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.landSize}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        landSize: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="mt-2 h-12 text-base bg-input border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <Label className="text-foreground mb-3 block">Irrigation Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {irrigationTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, irrigationType: type.value })
                        }
                        className={cn(
                          "p-4 rounded-xl border-2 text-center transition-all duration-300",
                          formData.irrigationType === type.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center",
                            formData.irrigationType === type.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {type.icon}
                        </div>
                        <p className="font-medium text-foreground text-sm">
                          {type.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {type.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12 border-border text-foreground hover:bg-muted bg-transparent"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={cn(
                "h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300",
                step === 0 ? "w-full" : "flex-1"
              )}
            >
              {step === 2 ? "Get Recommendations" : "Continue"}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trust Badge */}
      <p className="text-xs text-muted-foreground mt-6 text-center">
        Powered by AI • Trusted by 10,000+ farmers
      </p>
    </div>
  );
}
