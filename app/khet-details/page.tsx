"use client";

import { useState } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Droplets, User, Tractor, Wallet, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/language-context";


// Schema for Khet Details
const khetSchema = z.object({
    region: z.string({ required_error: "Please select your region." }),
    season: z.string({ required_error: "Please select the current season." }),
    waterAccess: z.string({ required_error: "Please select water access type." }),
    experienceLevel: z.string({ required_error: "Please select your experience level." }),
    landSize: z.array(z.number()).refine((val) => val[0] > 0, { message: "Land size must be greater than 0." }),
    budget: z.string({ required_error: "Please select your budget range." }),
});

type KhetValues = z.infer<typeof khetSchema>;

export default function KhetDetailsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useLanguage();

    const form = useForm<KhetValues>({
        resolver: zodResolver(khetSchema),
        defaultValues: {
            landSize: [5], // Default 5 acres
        },
    });

    function onSubmit(data: KhetValues) {
        setIsLoading(true);
        console.log("Khet Details:", data);

        // Map form values to the structure expected by Advisor
        const mappedData = {
            location: data.region === "north" ? "North India" :
                data.region === "south" ? "South India" :
                    data.region === "east" ? "East India" :
                        data.region === "west" ? "West India" : "Central India",
            season: data.season.charAt(0).toUpperCase() + data.season.slice(1),
            landSize: data.landSize[0],
            irrigationType: data.waterAccess === "rainfed" ? "Rainfed" : "Irrigated"
        };

        // Save to localStorage for persistence
        localStorage.setItem("khetDetails", JSON.stringify(mappedData));

        // Simulate processing and redirect to Advisor
        setTimeout(() => {
            router.push("/advisor");
            setIsLoading(false);
        }, 1000);
    }

    return (
        <>

            <div className="container max-w-3xl mx-auto py-10 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">{t("khet.title")}</h1>
                    <p className="text-muted-foreground">{t("khet.subtitle")}</p>
                </div>

                <Card className="border-green-100 dark:border-green-800 shadow-lg">
                    <CardHeader className="bg-green-50/50 dark:bg-green-950/40 border-b border-green-100 dark:border-green-800">
                        <CardTitle className="flex items-center gap-2 text-foreground">
                            <Tractor className="w-5 h-5 text-green-600 dark:text-green-400" /> {t("khet.farmConfig")}
                        </CardTitle>
                        <CardDescription>{t("khet.farmConfigDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Region */}
                                    <FormField
                                        control={form.control}
                                        name="region"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2"><MapPin className="w-4 h-4 text-green-600 dark:text-green-400" /> {t("khet.region")}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t("khet.selectRegion")} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="north">{t("khet.northIndia")}</SelectItem>
                                                        <SelectItem value="south">{t("khet.southIndia")}</SelectItem>
                                                        <SelectItem value="east">{t("khet.eastIndia")}</SelectItem>
                                                        <SelectItem value="west">{t("khet.westIndia")}</SelectItem>
                                                        <SelectItem value="central">{t("khet.centralIndia")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Season */}
                                    <FormField
                                        control={form.control}
                                        name="season"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-500" /> {t("khet.season")}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t("khet.selectSeason")} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="kharif">{t("khet.kharif")}</SelectItem>
                                                        <SelectItem value="rabi">{t("khet.rabi")}</SelectItem>
                                                        <SelectItem value="zaid">{t("khet.zaid")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Water Access */}
                                    <FormField
                                        control={form.control}
                                        name="waterAccess"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-500" /> {t("khet.waterAccess")}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t("khet.selectSource")} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="rainfed">{t("khet.rainfed")}</SelectItem>
                                                        <SelectItem value="tubewell">{t("khet.tubewell")}</SelectItem>
                                                        <SelectItem value="canal">{t("khet.canal")}</SelectItem>
                                                        <SelectItem value="drip">{t("khet.drip")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Experience Level */}
                                    <FormField
                                        control={form.control}
                                        name="experienceLevel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2"><User className="w-4 h-4 text-purple-500" /> {t("khet.experienceLevel")}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t("khet.selectLevel")} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="beginner">{t("khet.beginner")}</SelectItem>
                                                        <SelectItem value="intermediate">{t("khet.intermediate")}</SelectItem>
                                                        <SelectItem value="expert">{t("khet.expert")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Land Size Slider */}
                                <FormField
                                    control={form.control}
                                    name="landSize"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex justify-between items-center">
                                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-600" /> {t("khet.landSize")}</span>
                                                <span className="text-green-700 dark:text-green-300 font-bold bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded text-sm">{field.value[0]} {t("khet.acres")}</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Slider
                                                    min={1}
                                                    max={50}
                                                    step={1}
                                                    defaultValue={[5]}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    className="py-4"
                                                />
                                            </FormControl>
                                            <FormDescription className="flex justify-between text-xs text-muted-foreground">
                                                <span>{t("khet.smallAcre")}</span>
                                                <span>{t("khet.largeAcres")}</span>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Budget */}
                                <FormField
                                    control={form.control}
                                    name="budget"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><Wallet className="w-4 h-4 text-emerald-600" /> {t("khet.budget")}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("khet.selectBudget")} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="low">{t("khet.budgetLow")}</SelectItem>
                                                    <SelectItem value="medium">{t("khet.budgetMedium")}</SelectItem>
                                                    <SelectItem value="high">{t("khet.budgetHigh")}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>{t("khet.budgetDesc")}</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="pt-4">
                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-lg h-12" disabled={isLoading}>
                                        {isLoading ? t("khet.processing") : (
                                            <span className="flex items-center gap-2">{t("khet.getRecommendation")} <ArrowRight className="w-5 h-5" /></span>
                                        )}
                                    </Button>
                                </div>

                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
