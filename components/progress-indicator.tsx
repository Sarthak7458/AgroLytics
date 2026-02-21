"use client";

import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  labels = ["Location", "Season", "Farm Details"],
}: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ease-out",
                index < currentStep
                  ? "bg-primary text-primary-foreground scale-100"
                  : index === currentStep
                  ? "bg-primary text-primary-foreground scale-110 ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-2 font-medium transition-colors duration-300",
                index <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {labels[index]}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-1 bg-muted rounded-full mt-4 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
