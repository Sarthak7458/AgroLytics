"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/context/language-context";

export function LoadingScreen() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const { t } = useLanguage();

  const loadingMessages = [
    t("loading.msg1"),
    t("loading.msg2"),
    t("loading.msg3"),
    t("loading.msg4"),
    t("loading.msg5"),
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md w-full">
        {/* Animated Logo */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-primary/30 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-primary animate-pulse"
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
        </div>

        {/* Loading Message */}
        <div className="h-8 mb-6 relative">
          {loadingMessages.map((message, index) => (
            <p
              key={message}
              className={cn(
                "text-lg font-medium text-foreground transition-all duration-500 absolute left-0 right-0",
                currentMessage === index
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
            >
              {message}
            </p>
          ))}
        </div>

        {/* Indeterminate Progress Bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4 relative">
          <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-primary rounded-full animate-indeterminate" />
        </div>

        <style jsx>{`
          @keyframes indeterminate {
            0% { left: -35%; width: 30%; }
            60% { left: 100%; width: 100%; }
            100% { left: 100%; width: 10%; }
          }
          .animate-indeterminate {
            animation: indeterminate 2s infinite linear;
          }
        `}</style>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
