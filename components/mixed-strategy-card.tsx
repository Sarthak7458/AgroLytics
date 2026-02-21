"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle, ArrowRight, PieChart } from "lucide-react";
import { useLanguage } from "@/app/context/language-context";

interface ReducedCrop {
    name: string;
    profit: number; // profit per acre
}

interface MixedStrategyCardProps {
    mainCrop: ReducedCrop;
    alternativeCrop: ReducedCrop;
    landSize: number;
}

export function MixedStrategyCard({ mainCrop, alternativeCrop, landSize }: MixedStrategyCardProps) {
    const { t } = useLanguage();
    // Heuristic: 60% Main, 40% Alternative
    const splitRatio = 0.6;
    const mainLand = landSize * splitRatio;
    const altLand = landSize * (1 - splitRatio);

    const mainProfitOriginal = mainCrop.profit * landSize;

    // Calculate mixed profit
    // Basic Assumption: Profit rates remain same (simplification)
    const mixedMainProfit = mainCrop.profit * mainLand;
    const mixedAltProfit = alternativeCrop.profit * altLand;
    const totalMixedProfit = mixedMainProfit + mixedAltProfit;

    const profitImpact = totalMixedProfit - mainProfitOriginal;
    const isProfitPositive = profitImpact >= 0;

    return (
        <Card className="border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/20 overflow-hidden">
            <CardHeader className="bg-green-100/50 dark:bg-green-900/30 pb-4">
                <div className="flex items-center gap-2 mb-1">
                    <PieChart className="w-5 h-5 text-green-700 dark:text-green-400" />
                    <span className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">{t("results.strategicRecommendation")}</span>
                </div>
                <CardTitle className="text-xl">{t("results.optimizedPlan")}</CardTitle>
                <CardDescription>
                    {t("results.diversifyLand")}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Visual Split */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between text-sm font-medium mb-2">
                            <span>{t("results.landAllocation")}</span>
                            <span className="text-muted-foreground">{landSize} {t("results.totalAcres")}</span>
                        </div>

                        <div className="relative h-12 flex rounded-lg overflow-hidden border border-green-200 dark:border-green-700 shadow-sm">
                            <div className="bg-green-500 flex items-center justify-center text-white font-bold text-sm" style={{ width: "60%" }}>
                                {t(`crop.${mainCrop.name.toLowerCase()}`) || mainCrop.name} (60%)
                            </div>
                            <div className="bg-yellow-400 flex items-center justify-center text-yellow-900 font-bold text-sm" style={{ width: "40%" }}>
                                {t(`crop.${alternativeCrop.name.toLowerCase()}`) || alternativeCrop.name} (40%)
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{mainLand.toFixed(1)} {t("khet.acres")}</span>
                            <span>{altLand.toFixed(1)} {t("khet.acres")}</span>
                        </div>

                        <div className="bg-card p-4 rounded-xl border border-green-100 dark:border-green-800 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">{t("results.projectedProfit")}</span>
                                <Badge variant={isProfitPositive ? "default" : "secondary"} className={isProfitPositive ? "bg-green-600" : ""}>
                                    {isProfitPositive ? "+" : ""}{((totalMixedProfit / mainProfitOriginal * 100) - 100).toFixed(1)}% {t("results.vsMono")}
                                </Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                ₹{totalMixedProfit.toLocaleString("en-IN")}
                            </div>

                        </div>
                    </div>

                    {/* Analysis */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" /> {t("results.advantages")}
                            </h4>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-[10px] px-1.5 py-0.5 rounded font-bold mt-0.5">{t("results.riskLabel")}</span>
                                    <span>{t("results.riskDesc")}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded font-bold mt-0.5">{t("results.soilLabel")}</span>
                                    <span>{t("results.soilDesc")}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 text-[10px] px-1.5 py-0.5 rounded font-bold mt-0.5">{t("results.marketLabel")}</span>
                                    <span>{t("results.marketDesc")}</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500" /> {t("results.tradeOffs")}
                            </h4>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                                <li className="bg-orange-50 dark:bg-orange-950/30 p-2 rounded border border-orange-100 dark:border-orange-800">
                                    {t("results.tradeOffDesc")}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
