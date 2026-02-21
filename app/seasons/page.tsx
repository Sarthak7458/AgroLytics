"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { Calendar, Droplets, Sun, Sprout, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/app/context/language-context";

// Mock data for crop activities
const seasonsData = {
    kharif: {
        name: "Kharif Season",
        period: "June - October",
        crops: [
            {
                name: "Rice (Paddy)",
                activities: [
                    { title: "Land Preparation", desc: "Plough the field 3-4 times. Level the land perfectly for uniform water distribution.", time: "June - 1st Week", icon: <Sun className="w-8 h-8 text-orange-500" /> },
                    { title: "Sowing / Transplanting", desc: "Transplant 21-25 days old seedlings. Maintain 2-3 seedlings per hill.", time: "July - 2nd Week", icon: <Sprout className="w-8 h-8 text-green-500" /> },
                    { title: "Water Management", desc: "Maintain 2-5 cm water level throughout the vegetative phase. Drain before harvest.", time: "August - Constant", icon: <Droplets className="w-8 h-8 text-blue-500" /> },
                    { title: "Harvesting", desc: "Harvest when 80% grains turn golden yellow. Dry to 14% moisture.", time: "Oct - 1st Week", icon: <Calendar className="w-8 h-8 text-yellow-500" /> },
                ]
            },
            {
                name: "Maize",
                activities: [
                    { title: "Seed Treatment", desc: "Treat with fungicide to prevent soil-borne diseases.", time: "June - 3rd Week", icon: <Sprout className="w-8 h-8 text-green-600" /> },
                    { title: "Sowing", desc: "Sow on ridges for better drainage. Row spacing 60cm.", time: "June - End", icon: <Sun className="w-8 h-8 text-orange-500" /> },
                    { title: "Weeding", desc: "Critical weed-free period is up to 45 days. Do inter-cultivation.", time: "July - End", icon: <Sprout className="w-8 h-8 text-red-400" /> },
                    { title: "Harvesting", desc: "Harvest when cob sheath turns dry and grains are hard.", time: "Sept - End", icon: <Calendar className="w-8 h-8 text-yellow-500" /> },
                ]
            },
            {
                name: "Cotton",
                activities: [
                    { title: "Sowing", desc: "Use Bt cotton hybrids if resistant to bolworms. Spacing 90x60cm.", time: "May - June", icon: <Sprout className="w-8 h-8 text-green-500" /> },
                    { title: "Irrigation", desc: "Requires less water. Avoid water logging at flowering stage.", time: "July - Aug", icon: <Droplets className="w-8 h-8 text-blue-500" /> },
                    { title: "Pest Control", desc: "Monitor for sucking pests and bollworms. Use integrated pest management.", time: "Aug - Sept", icon: <Sprout className="w-8 h-8 text-red-500" /> },
                    { title: "Picking", desc: "Pick fully opened bolls. Avoid contamination.", time: "Oct - Nov", icon: <Calendar className="w-8 h-8 text-white" /> },
                ]
            },
            {
                name: "Sugarcane",
                activities: [
                    { title: "Planting", desc: "Plant setts in furrows. Treat setts with hot water for disease control.", time: "Spring/Autumn", icon: <Sprout className="w-8 h-8 text-green-700" /> },
                    { title: "Earthing Up", desc: "Done at 45 days and 90 days to prevent lodging.", time: "June - July", icon: <Sun className="w-8 h-8 text-orange-600" /> },
                    { title: "Irrigation", desc: "Provide frequent irrigation during summer months.", time: "April - June", icon: <Droplets className="w-8 h-8 text-blue-600" /> },
                    { title: "Harvesting", desc: "Check brix reading before harvest for peak sugar recovery.", time: "Dec - March", icon: <Calendar className="w-8 h-8 text-yellow-600" /> },
                ]
            }
        ]
    },
    rabi: {
        name: "Rabi Season",
        period: "October - March",
        crops: [
            {
                name: "Wheat",
                activities: [
                    { title: "Sowing", desc: "Optimum time early November. Seed rate 100kg/ha.", time: "Nov - 1st Week", icon: <Sprout className="w-8 h-8 text-green-500" /> },
                    { title: "Irrigation - CRI", desc: "First irrigation at Crown Root Initiation stage (21 days) is critical.", time: "Nov - End", icon: <Droplets className="w-8 h-8 text-blue-500" /> },
                    { title: "Fertilizer", desc: "Apply Nitrogen in split doses. Top dress at tillering.", time: "Dec - Mid", icon: <Sun className="w-8 h-8 text-orange-500" /> },
                    { title: "Harvesting", desc: "Harvest when grains are hard and straw is golden.", time: "March - End", icon: <Calendar className="w-8 h-8 text-yellow-500" /> },
                ]
            },
            {
                name: "Mustard",
                activities: [
                    { title: "Sowing", desc: "Sow mid-September to mid-October to avoid aphid attack.", time: "Sept - Oct", icon: <Sprout className="w-8 h-8 text-yellow-400" /> },
                    { title: "Thinning", desc: "Maintain plant to plant distance of 10-15cm by thinning at 15-20 DAS.", time: "Nov - Early", icon: <Sun className="w-8 h-8 text-orange-400" /> },
                    { title: "Protection", desc: "Spray for protection against white rust and aphids if needed.", time: "Dec - Jan", icon: <Sprout className="w-8 h-8 text-red-500" /> },
                    { title: "Harvesting", desc: "Harvest when 75% pods turn yellow.", time: "Feb - March", icon: <Calendar className="w-8 h-8 text-yellow-600" /> },
                ]
            },
            {
                name: "Gram (Chickpea)",
                activities: [
                    { title: "Seed Treatment", desc: "Treat seed with Rhizobium culture.", time: "Oct - End", icon: <Sprout className="w-8 h-8 text-green-700" /> },
                    { title: "Sowing", desc: "Sow in lines 30cm apart. Deep sowing favors root development.", time: "Oct - Nov", icon: <Sun className="w-8 h-8 text-orange-600" /> },
                    { title: "Nipping", desc: "Nip the apical buds at 50-60 days to encourage branching.", time: "Dec - Jan", icon: <Sprout className="w-8 h-8 text-green-500" /> },
                    { title: "Harvesting", desc: "Harvest when plants dry and leaves fall off.", time: "March - April", icon: <Calendar className="w-8 h-8 text-yellow-600" /> },
                ]
            }
        ]
    },
    zaid: {
        name: "Zaid Season",
        period: "March - June",
        crops: [
            {
                name: "Watermelon",
                activities: [
                    { title: "Sowing", desc: "Sow in pits with FYM. Space pits 2m apart.", time: "Feb - March", icon: <Sprout className="w-8 h-8 text-green-500" /> },
                    { title: "Irrigation", desc: "Frequent irrigation required. 5-7 days interval.", time: "April - May", icon: <Droplets className="w-8 h-8 text-blue-500" /> },
                    { title: "Harvesting", desc: "Harvest when tendril near fruit dries up.", time: "June - Early", icon: <Calendar className="w-8 h-8 text-yellow-500" /> },
                ]
            },
            {
                name: "Cucumber",
                activities: [
                    { title: "Sowing", desc: "Direct seed sowing in prepared beds/pits.", time: "Feb - March", icon: <Sprout className="w-8 h-8 text-green-600" /> },
                    { title: "Staking", desc: "Provide support/staking for creeper variety.", time: "April - Early", icon: <Sun className="w-8 h-8 text-orange-500" /> },
                    { title: "Harvesting", desc: "Harvest tender fruits every 2-3 days.", time: "May - June", icon: <Calendar className="w-8 h-8 text-green-700" /> },
                ]
            },
            {
                name: "Pumpkin",
                activities: [
                    { title: "Sowing", desc: "Sow 2-3 seeds per pit. Requires warm weather.", time: "Feb - March", icon: <Sprout className="w-8 h-8 text-orange-600" /> },
                    { title: "Manuring", desc: "Top dress with nitrogen at vining stage.", time: "April - Mid", icon: <Sun className="w-8 h-8 text-yellow-500" /> },
                    { title: "Harvesting", desc: "Harvest when fruit skin becomes hard and colour changes.", time: "May - June", icon: <Calendar className="w-8 h-8 text-orange-700" /> },
                ]
            }
        ]
    }
};

const FlashCard = ({ data, index, onSwipe, t, cropKeyPrefix }: { data: any, index: number, onSwipe: () => void, t: any, cropKeyPrefix: string }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    const handleDragEnd = (event: any, info: any) => {
        if (Math.abs(info.offset.x) > 100) {
            onSwipe();
        }
    };

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute top-0 left-0 w-full h-full bg-white dark:bg-card rounded-xl shadow-xl border border-green-100 dark:border-green-800 p-8 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="mb-6 bg-green-50 dark:bg-green-950/40 p-6 rounded-full">
                {data.icon}
            </div>
            <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">{t(`${cropKeyPrefix}.${index}.title`) || data.title}</h3>
            <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-sm font-semibold rounded-full mb-4">
                {t(`${cropKeyPrefix}.${index}.time`) || data.time}
            </span>
            <p className="text-gray-600 dark:text-muted-foreground text-lg leading-relaxed">
                {t(`${cropKeyPrefix}.${index}.desc`) || data.desc}
            </p>
            <div className="absolute bottom-6 text-xs text-muted-foreground flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> {t("seasons.swipeNext") || "Swipe for next activity"} <ArrowRight className="w-3 h-3" />
            </div>
        </motion.div>
    );
};

export default function SeasonsPage() {
    const { t } = useLanguage();
    const [activeSeason, setActiveSeason] = useState("kharif");
    const [activeCropIndex, setActiveCropIndex] = useState(0);
    const [activeCardIndex, setActiveCardIndex] = useState(0);

    const currentSeason = (seasonsData as any)[activeSeason];
    const currentCrop = currentSeason.crops[activeCropIndex];
    let baseName = currentCrop.name.split(" ")[0].toLowerCase();
    if (baseName === "gram") baseName = "chickpea"; // Handle Chickpea aliasing just in case, or "gram" to match keys
    const cropKeyPrefix = `act.${baseName}`;

    const handleSwipe = () => {
        // Move to next card, loop back to start if end
        if (activeCardIndex < currentCrop.activities.length - 1) {
            setActiveCardIndex(prev => prev + 1);
        } else {
            setActiveCardIndex(0); // Loop back or could show a "Completed" card
        }
    };

    const handleResetCard = () => setActiveCardIndex(0);

    return (
        <>

            <div className="container mx-auto py-10 px-4 min-h-[calc(100vh-64px)]">
                <h1 className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">{t("seasons.title")}</h1>
                <p className="text-muted-foreground mb-8">{t("seasons.subtitle")}</p>

                <Tabs defaultValue="kharif" className="w-full" onValueChange={(val) => { setActiveSeason(val); setActiveCropIndex(0); setActiveCardIndex(0); }}>
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="kharif">{t("khet.kharif") || "Kharif (Monsoon)"}</TabsTrigger>
                        <TabsTrigger value="rabi">{t("khet.rabi") || "Rabi (Winter)"}</TabsTrigger>
                        <TabsTrigger value="zaid">{t("khet.zaid") || "Zaid (Summer)"}</TabsTrigger>
                    </TabsList>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Sidebar List of Crops */}
                        <div className="md:col-span-1 space-y-4">
                            <h3 className="font-semibold text-lg text-green-800 dark:text-green-300">{t("seasons.availableCrops")}</h3>
                            <div className="flex flex-col gap-2">
                                {currentSeason.crops.map((crop: any, idx: number) => (
                                    <Button
                                        key={idx}
                                        variant={activeCropIndex === idx ? "default" : "outline"}
                                        className={`justify-start ${activeCropIndex === idx ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white" : ""}`}
                                        onClick={() => { setActiveCropIndex(idx); setActiveCardIndex(0); }}
                                    >
                                        {t(`crop.${crop.name.split(" ")[0].toLowerCase()}`) || crop.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Main Interactive Area */}
                        <div className="md:col-span-2 flex flex-col items-center">
                            <div className="relative w-full max-w-sm h-96">
                                <AnimatePresence>
                                    {/* Render Current Card */}
                                    {/* We use a key based on index so framer knows it changed */}
                                    <FlashCard
                                        key={`${activeSeason}-${activeCropIndex}-${activeCardIndex}`}
                                        data={currentCrop.activities[activeCardIndex]}
                                        index={activeCardIndex}
                                        onSwipe={handleSwipe}
                                        t={t}
                                        cropKeyPrefix={cropKeyPrefix}
                                    />
                                </AnimatePresence>
                            </div>

                            <div className="mt-8 flex gap-2">
                                {currentCrop.activities.map((_: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-colors ${idx === activeCardIndex ? "bg-green-600 dark:bg-green-400" : "bg-green-200 dark:bg-green-800"}`}
                                    />
                                ))}
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                                    {t("seasons.activity")} {activeCardIndex + 1} {t("seasons.of")} {currentCrop.activities.length}
                                </p>
                                <Button variant="ghost" size="sm" onClick={handleResetCard} className="text-muted-foreground">
                                    {t("seasons.restartGuide") || "Restart Guide"}
                                </Button>
                            </div>
                        </div>
                    </div>

                </Tabs>

                <div className="mt-12 flex justify-center">
                    <Link href="/dashboard">
                        <Button size="lg" className="bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all scale-100 hover:scale-105">
                            {t("seasons.finish")} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}
