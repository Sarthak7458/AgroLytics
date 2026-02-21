"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CloudRain, TrendingUp, Bug, CheckCircle2, Info, ThermometerSun, Droplets, Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/context/language-context";

// Schema for Risk Input
const riskSchema = z.object({
    crop: z.string({ required_error: "Please select a crop." }),
    location: z.string().min(2, "Location is required."),
    landSize: z.string().min(1, "Land size is required."),
    sowingMonth: z.string({ required_error: "Please select sowing month." }),
});

type RiskValues = z.infer<typeof riskSchema>;

// Off-Season Logic Map
// Months: 0=Jan, 11=Dec. Normalized for easy checking.
const cropSeasons: Record<string, number[]> = {
    "Wheat": [9, 10, 11], // Oct-Dec (Rabi)
    "Rice": [5, 6, 7],    // June-Aug (Kharif) - Main. Summer rice exists but is distinct.
    "Cotton": [4, 5, 6],  // May-July
    "Sugarcane": [0, 1, 2, 9, 10], // Jan-Mar or Oct-Nov
    "Tomato": [0, 1, 5, 6, 7, 8, 9, 10], // Almost year round but Summer (March-May) is tricky
    "Onion": [5, 6, 9, 10, 0, 1], // Kharif, Late Kharif, Rabi
};

const monthToNum: Record<string, number> = {
    "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
    "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
};

// Mock Risk Analysis Logic with Off-Season Detection
const analyzeRisk = (data: RiskValues) => {
    let weatherRisk = { level: "Low", score: 30, message: "Favorable weather predicted." };
    let marketRisk = { level: "Medium", score: 50, message: "Moderate price fluctuation expected." };
    let diseaseRisk = { level: "Low", score: 20, message: "Standard prevention required." };
    let overallRisk = "Low";

    let isOffSeason = false;
    let offSeasonAdvice = null;

    const cropOne = data.crop;
    const monthNum = monthToNum[data.sowingMonth];

    // 1. Off-Season Check
    if (cropSeasons[cropOne] && !cropSeasons[cropOne].includes(monthNum)) {
        isOffSeason = true;
        weatherRisk = { level: "High", score: 85, message: `High stress conditions for ${cropOne} in ${data.sowingMonth}.` };
        diseaseRisk = { level: "High", score: 75, message: "Increased susceptibility to non-seasonal pests." };

        // Define specific advice
        offSeasonAdvice = {
            title: `Off-Season ${cropOne} Guide`,
            challenges: [
                "Severe temperature mismatch for grain filling/fruiting.",
                "High irrigation requirement due to evaporation.",
                "Potential pest outbreaks absent in normal season."
            ],
            requirements: [
                "Install Drip Irrigation immediately to manage water stress.",
                "Use shade nets or mulching to control soil temperature.",
                "Select specific short-duration or heat-tolerant varieties."
            ],
            verdict: "High Risk, High Cost. Proceed only with expert supervision."
        };
    }

    // 2. Specific Crop Heuristics
    if (data.crop === "Tomato" || data.crop === "Onion") {
        marketRisk = { level: "High", score: 85, message: "High price volatility historically." };
    }

    // 3. Summer Rice specific check
    if (data.crop === "Rice" && (data.sowingMonth === "April" || data.sowingMonth === "May")) {
        isOffSeason = true;
        weatherRisk = { level: "Critical", score: 95, message: "Extreme water demand predicted." };
        offSeasonAdvice = {
            title: "Summer Rice Survival Guide",
            challenges: ["Massive water footprint.", "Heat stress affecting pollination."],
            requirements: ["Ensure continuous canal/tubewell water supply.", "Apply silicon fertilizers to boost heat tolerance."],
            verdict: "Viable only with assured irrigation."
        };
    }


    // Calculate Overall
    const avgScore = (weatherRisk.score + marketRisk.score + diseaseRisk.score) / 3;
    if (avgScore > 70) overallRisk = "High";
    else if (avgScore > 40) overallRisk = "Medium";

    return { weatherRisk, marketRisk, diseaseRisk, overallRisk, avgScore, isOffSeason, offSeasonAdvice };
};

export default function RiskAnalysisPage() {
    const { t } = useLanguage();
    const [report, setReport] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RiskValues>({
        resolver: zodResolver(riskSchema),
        defaultValues: {
            location: "",
            landSize: "",
        },
    });

    // Auto-fill from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem("khetDetails");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.location) form.setValue("location", parsed.location);
                if (parsed.landSize) form.setValue("landSize", parsed.landSize.toString());
            } catch (e) {
                console.error("Failed to parse khetDetails", e);
            }
        }
    }, [form]);

    function onSubmit(data: RiskValues) {
        setIsLoading(true);
        setReport(null); // Reset previous report
        // Simulate API delay
        setTimeout(() => {
            const result = analyzeRisk(data);
            setReport(result);
            setIsLoading(false);
        }, 1500);
    }

    const getRiskColor = (level: string) => {
        switch (level) {
            case "High": case "Critical": return "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/40 border-red-200 dark:border-red-800";
            case "Medium": return "text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800";
            case "Low": return "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/40 border-green-200 dark:border-green-800";
            default: return "text-gray-600 dark:text-muted-foreground";
        }
    };

    const getProgressColor = (score: number) => {
        if (score > 70) return "bg-red-500";
        if (score > 40) return "bg-orange-500";
        return "bg-green-500";
    };

    return (
        <>

            <div className="container max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">{t("risk.title")}</h1>
                <p className="text-muted-foreground mb-8">{t("risk.subtitle")}</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Form */}
                    <div className="lg:col-span-1">
                        <Card className="border-green-100 dark:border-green-800 shadow-md">
                            <CardHeader>
                                <CardTitle>{t("risk.analysisParams")}</CardTitle>
                                <CardDescription>{t("risk.paramsDesc")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="crop"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("risk.selectCrop") || "Select Crop"}</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={t("risk.chooseCrop") || "Choose a crop"} />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Wheat">{t("crop.wheat") || "Wheat"}</SelectItem>
                                                            <SelectItem value="Rice">{t("crop.rice") || "Rice"}</SelectItem>
                                                            <SelectItem value="Cotton">{t("crop.cotton") || "Cotton"}</SelectItem>
                                                            <SelectItem value="Sugarcane">{t("crop.sugarcane") || "Sugarcane"}</SelectItem>
                                                            <SelectItem value="Tomato">{t("crop.tomato") || "Tomato"}</SelectItem>
                                                            <SelectItem value="Onion">{t("crop.onion") || "Onion"}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="sowingMonth"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("risk.sowingMonth") || "Sowing Month"}</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={t("risk.selectMonth") || "Select Month"} />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                                                <SelectItem key={m} value={m}>{t(`month.${m.substring(0, 3).toLowerCase()}`) || m}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("risk.regionDistrict") || "Region / District"}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t("general.loading") || "Loading..."} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="landSize"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("khet.landSize") || "Land Size (Acres)"}</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder={t("general.loading") || "Loading..."} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white" disabled={isLoading}>
                                            {isLoading ? t("risk.analyzing") : t("risk.calculateRisk")}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Dashboard */}
                    <div className="lg:col-span-2">
                        {!report && !isLoading && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-border rounded-xl bg-gray-50/50 dark:bg-muted/20">
                                <Info className="w-12 h-12 text-gray-300 dark:text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 dark:text-muted-foreground">{t("risk.noAnalysis")}</h3>
                                <p className="text-gray-500 dark:text-muted-foreground/80 max-w-sm">{t("risk.noAnalysisDesc")}</p>
                            </div>
                        )}

                        {report && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                {/* Overall Risk Score */}
                                <Card className={`border-l-4 shadow-sm ${report.overallRisk === "High" ? "border-l-red-500" :
                                    report.overallRisk === "Medium" ? "border-l-orange-500" : "border-l-green-500"
                                    }`}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex justify-between items-center">
                                            Overall Risk Assessment
                                            <span className={`px-4 py-1 rounded-full text-sm font-bold border ${getRiskColor(report.overallRisk)}`}>
                                                {report.overallRisk} RISK
                                            </span>
                                        </CardTitle>
                                        <CardDescription>Based on historical data and current forecasts for {form.getValues("location")}.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="w-full bg-gray-200 dark:bg-muted rounded-full h-4 mb-2 overflow-hidden">
                                            <motion.div
                                                className={`h-4 rounded-full ${getProgressColor(report.avgScore)}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${report.avgScore}%` }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                            />
                                        </div>
                                        <p className="text-sm text-muted-foreground text-right">{Math.round(report.avgScore)}/100 Risk Score</p>
                                    </CardContent>
                                </Card>

                                {/* Off-Season Survival Guide (Conditional) */}
                                {report.isOffSeason && report.offSeasonAdvice && (
                                    <Alert className="border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30">
                                        <ThermometerSun className="h-5 w-5 text-orange-600" />
                                        <AlertTitle className="text-orange-800 dark:text-orange-300 font-bold mb-2 flex items-center gap-2">
                                            {report.offSeasonAdvice.title.replace('Guide', t('risk.guide') || 'Guide').replace(form.getValues("crop"), t(`crop.${form.getValues("crop").toLowerCase()}`) || form.getValues("crop"))}
                                        </AlertTitle>
                                        <AlertDescription>
                                            <div className="grid md:grid-cols-2 gap-4 mt-3">
                                                <div>
                                                    <h4 className="font-semibold text-orange-900 dark:text-orange-300 text-sm mb-1">Key Challenges:</h4>
                                                    <ul className="list-disc pl-4 text-sm text-orange-800 dark:text-orange-400 space-y-1">
                                                        {report.offSeasonAdvice.challenges.map((c: string, i: number) => <li key={i}>{c}</li>)}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-orange-900 dark:text-orange-300 text-sm mb-1">Required Interventions:</h4>
                                                    <ul className="list-disc pl-4 text-sm text-orange-800 dark:text-orange-400 space-y-1">
                                                        {report.offSeasonAdvice.requirements.map((r: string, i: number) => <li key={i}>{r}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-700">
                                                <span className="font-bold text-orange-900 dark:text-orange-300 text-sm">Verdict: </span>
                                                <span className="text-orange-800 dark:text-orange-400 text-sm font-medium">{report.offSeasonAdvice.verdict}</span>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Detailed Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Weather Risk */}
                                    <Card>
                                        <CardHeader className="pb-2 space-y-0">
                                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <CloudRain className="w-4 h-4 text-blue-500" /> Weather Risk
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold mb-1">{report.weatherRisk.level}</div>
                                            <p className="text-xs text-muted-foreground">{report.weatherRisk.message}</p>
                                            <div className="w-full bg-blue-100 dark:bg-blue-900/30 h-1.5 mt-3 rounded-full overflow-hidden">
                                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${report.weatherRisk.score}%` }}></div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Market Risk */}
                                    <Card>
                                        <CardHeader className="pb-2 space-y-0">
                                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-green-500" /> Market Risk
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold mb-1">{report.marketRisk.level}</div>
                                            <p className="text-xs text-muted-foreground">{report.marketRisk.message}</p>
                                            <div className="w-full bg-green-100 dark:bg-green-900/30 h-1.5 mt-3 rounded-full overflow-hidden">
                                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${report.marketRisk.score}%` }}></div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Disease Risk */}
                                    <Card>
                                        <CardHeader className="pb-2 space-y-0">
                                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <Bug className="w-4 h-4 text-red-500" /> Disease Risk
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold mb-1">{report.diseaseRisk.level}</div>
                                            <p className="text-xs text-muted-foreground">{report.diseaseRisk.message}</p>
                                            <div className="w-full bg-red-100 dark:bg-red-900/30 h-1.5 mt-3 rounded-full overflow-hidden">
                                                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${report.diseaseRisk.score}%` }}></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* General Recommendations (if not strictly off-season focused) */}
                                {!report.isOffSeason && (
                                    <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-6 border border-green-100 dark:border-green-800">
                                        <h4 className="font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" /> {t("risk.mitigationStrategies")}
                                        </h4>
                                        <ul className="space-y-2 text-sm text-green-800 dark:text-green-400">
                                            {report.overallRisk === "High" ? (
                                                <>
                                                    <li className="flex items-start gap-2">• Consider delaying sowing by 15 days to avoid peak weather stress.</li>
                                                    <li className="flex items-start gap-2">• Opt for disease-resistant seed varieties certified by the local agricultural board.</li>
                                                    <li className="flex items-start gap-2">• Hedge market risk by securing a pre-harvest contract if possible.</li>
                                                </>
                                            ) : (
                                                <>
                                                    <li className="flex items-start gap-2">• Standard crop insurance recommended.</li>
                                                    <li className="flex items-start gap-2">• Follow routine irrigation and pest management schedules.</li>
                                                    <li className="flex items-start gap-2">• Monitor local mandi prices for optimal selling time.</li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <Link href="/seasons">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white gap-2">
                            {t("risk.seasonalGuide")} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}
