"use client";

import { useState, useEffect, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Info, BellRing, Bell, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/app/context/language-context";

// --- Mock Market Data (Realistic 2025 Projections) ---
interface CropData {
    price: number;
    trend: number;
    // History pools for different ranges
    history1M: { date: string; price: number }[];
    history6M: { month: string; price: number }[];
    history1Y: { month: string; price: number }[];
}

const generateHistory = (base: number, volatility: number, count: number, type: 'daily' | 'monthly') => {
    let current = base;
    const data = [];
    const now = new Date();

    for (let i = count; i >= 0; i--) {
        const date = new Date();
        if (type === 'daily') date.setDate(now.getDate() - i);
        else date.setMonth(now.getMonth() - i);

        const change = (Math.random() - 0.5) * volatility;
        current += change;
        if (current < 100) current = 100;

        const baseItem: any = {
            price: Math.round(current)
        };
        if (type === 'daily') {
            baseItem.date = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        } else {
            baseItem.month = date.toLocaleDateString('en-US', { month: 'short' });
        }

        data.push(baseItem);
    }
    return data as any;
};

const initialMarketData: Record<string, CropData> = {
    "Wheat": { price: 2550, trend: 2.4, history1M: [], history6M: [], history1Y: [] },
    "Rice": { price: 4200, trend: -1.2, history1M: [], history6M: [], history1Y: [] },
    "Cotton": { price: 7800, trend: 5.1, history1M: [], history6M: [], history1Y: [] },
    "Sugarcane": { price: 355, trend: 0.0, history1M: [], history6M: [], history1Y: [] },
    "Tomato": { price: 3500, trend: -15.5, history1M: [], history6M: [], history1Y: [] },
    "Onion": { price: 2200, trend: 8.5, history1M: [], history6M: [], history1Y: [] },
    "Potato": { price: 1500, trend: 1.2, history1M: [], history6M: [], history1Y: [] },
    "Maize": { price: 2300, trend: 3.2, history1M: [], history6M: [], history1Y: [] },
    "Soybean": { price: 4800, trend: -2.1, history1M: [], history6M: [], history1Y: [] },
    "Turmeric": { price: 13500, trend: 12.4, history1M: [], history6M: [], history1Y: [] },
};

// Hydrate history on load
Object.keys(initialMarketData).forEach(key => {
    const base = initialMarketData[key].price;
    const vol = base * 0.05; // 5% volatility
    initialMarketData[key].history1M = generateHistory(base, vol / 5, 30, 'daily');
    initialMarketData[key].history6M = generateHistory(base, vol, 6, 'monthly');
    initialMarketData[key].history1Y = generateHistory(base, vol * 1.5, 12, 'monthly');
});

const NEWS_HEADLINES = [
    "news.1",
    "news.2",
    "news.3",
    "news.4",
    "news.5",
    "news.6"
];

// Context Default
const seasonMap: Record<string, string> = { "Kharif": "Rice", "Rabi": "Wheat", "Zaid": "Tomato" };

export default function MarketPage() {
    const { t } = useLanguage();
    const [selectedCrop, setSelectedCrop] = useState("Wheat");
    const [marketData, setMarketData] = useState(initialMarketData);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [timeRange, setTimeRange] = useState("6m");

    // Alert State
    const [targetPrice, setTargetPrice] = useState<string>("");
    const [activeAlert, setActiveAlert] = useState<{ crop: string, price: number } | null>(null);
    const [showAlertInput, setShowAlertInput] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

    // Auto-Select based on Profile
    useEffect(() => {
        const savedData = localStorage.getItem("khetDetails");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.season && seasonMap[parsed.season]) setSelectedCrop(seasonMap[parsed.season]);
            } catch (e) {
                console.error("Failed to read khetDetails");
            }
        }
    }, []);

    // News Ticker
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentNewsIndex((prev) => (prev + 1) % NEWS_HEADLINES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Live Price Simulation & Alert Check
    useEffect(() => {
        const interval = setInterval(() => {
            setMarketData(prevData => {
                const newData = { ...prevData };

                // Update all crops
                Object.keys(newData).forEach(key => {
                    const volatility = key === "Sugarcane" ? 0 : (Math.random() - 0.5) * 8; // Slightly more movement
                    let newPrice = newData[key].price + volatility;
                    if (newPrice < 100) newPrice = 100;
                    newData[key] = { ...newData[key], price: newPrice };
                });

                // Check Alert
                if (activeAlert) {
                    const currentPrice = newData[activeAlert.crop].price;
                    // Trigger if price crosses target (simple logic: >= target)
                    if (currentPrice >= activeAlert.price) {
                        setNotification({
                            message: `🔔 Price Alert! ${activeAlert.crop} has reached ₹${Math.floor(currentPrice)} (Target: ₹${activeAlert.price})`,
                            type: 'success'
                        });
                        setActiveAlert(null); // Clear alert after firing
                    }
                }

                return newData;
            });
        }, 2000); // 2 seconds tick

        return () => clearInterval(interval);
    }, [activeAlert]); // Re-bind when activeAlert changes

    const handleSetAlert = () => {
        if (!targetPrice || isNaN(Number(targetPrice))) return;
        setActiveAlert({ crop: selectedCrop, price: Number(targetPrice) });
        setShowAlertInput(false);
        setNotification({ message: `Alert set for ${selectedCrop} at ₹${targetPrice}`, type: 'info' });
        setTimeout(() => setNotification(null), 3000); // Hide confirmation after 3s
    };

    const currentData = marketData[selectedCrop];
    const isPositive = currentData.trend >= 0;

    // Chart Data Selection
    const chartData = useMemo(() => {
        switch (timeRange) {
            case '1m': return currentData.history1M;
            case '1y': return currentData.history1Y;
            case '6m': default: return currentData.history6M;
        }
    }, [currentData, timeRange]);

    return (
        <div className="container max-w-6xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold text-green-900 dark:text-green-100">{t("market.title")}</h1>
                        <Badge variant="outline" className="animate-pulse border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30">
                            {t("market.liveBadge")}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">Real-time agricultural commodity prices & analytics (2025).</p>
                </div>

                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger className="w-[200px] border-green-200 dark:border-green-700 shadow-sm">
                        <SelectValue placeholder={t("market.selectCrop")} />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(marketData).map((crop) => (
                            <SelectItem key={crop} value={crop}>{t(`crop.${crop.toLowerCase()}`) || crop}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Breaking News */}
            <Card className="mb-6 bg-slate-900 border-none text-white shadow-lg overflow-hidden relative">
                <div className="flex items-center p-3">
                    <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded font-bold text-xs uppercase tracking-wider mr-4 shadow-sm z-10">
                        <BellRing className="w-3 h-3" /> {t("market.insight") || "Market Insight"}
                    </div>
                    <div className="flex-1 overflow-hidden h-6 relative">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentNewsIndex}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-sm font-medium absolute w-full truncate"
                            >
                                {t(NEWS_HEADLINES[currentNewsIndex]) || NEWS_HEADLINES[currentNewsIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </Card>

            {/* Notifications Banner */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                    >
                        <Alert className={`${notification.type === 'success' ? 'bg-green-100 dark:bg-green-950/40 border-green-300 dark:border-green-700' : 'bg-blue-100 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700'}`}>
                            {notification.type === 'success' ? <BellRing className="h-4 w-4 text-green-600" /> : <Info className="h-4 w-4 text-blue-600" />}
                            <AlertTitle className="font-bold">{notification.type === 'success' ? t("market.alertTriggered") : t("market.notification")}</AlertTitle>
                            <AlertDescription>{notification.message}</AlertDescription>
                            <Button variant="ghost" size="sm" className="absolute top-2 right-2 h-6 w-6 p-0" onClick={() => setNotification(null)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Current Price */}
                    <Card className="border-t-4 border-t-green-600 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t("market.currentMandiPrice") || "Current Mandi Price"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-foreground">
                                    ₹{Math.floor(currentData.price).toLocaleString()}
                                </span>
                                <span className="text-sm font-medium text-muted-foreground">/ quintal</span>
                            </div>
                            <div className={`flex items-center mt-2 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                {isPositive ? <ArrowUpRight className="w-5 h-5 mr-1" /> : <ArrowDownRight className="w-5 h-5 mr-1" />}
                                <span className="font-bold">{Math.abs(currentData.trend)}%</span>
                                <span className="text-muted-foreground ml-1 text-xs">{t("market.past24h") || "past 24h"}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Price Alert Control */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Bell className="w-4 h-4 text-orange-500" /> {t("market.setAlert")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!showAlertInput && !activeAlert ? (
                                <Button
                                    variant="outline"
                                    className="w-full border-dashed border-2 hover:border-solid hover:border-green-500 text-muted-foreground hover:text-green-600"
                                    onClick={() => setShowAlertInput(true)}
                                >
                                    {t("market.setTargetPrice")}
                                </Button>
                            ) : activeAlert ? (
                                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-700 rounded-lg p-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase">{t("market.watchingFor")}</p>
                                        <p className="text-lg font-bold text-orange-900 dark:text-orange-300">₹{activeAlert.price}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setActiveAlert(null)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">{t("market.cancel")}</Button>
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="target-price" className="text-xs">{t("market.targetPriceLabel") || "Target Price (₹)"}</Label>
                                        <Input
                                            id="target-price"
                                            type="number"
                                            placeholder="e.g. 2600"
                                            value={targetPrice}
                                            onChange={(e) => setTargetPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white" onClick={handleSetAlert}>{t("market.setAlert")}</Button>
                                        <Button variant="ghost" onClick={() => setShowAlertInput(false)}>{t("market.cancel")}</Button>
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground uppercase">{t("market.highest") || "Highest"}</p>
                                <p className="text-xl font-bold">₹{Math.floor(currentData.price * 1.05)}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground uppercase">{t("market.lowest") || "Lowest"}</p>
                                <p className="text-xl font-bold">₹{Math.floor(currentData.price * 0.92)}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Interactive Charts */}
                <div className="lg:col-span-2">
                    <Card className="h-full border-green-100 dark:border-green-800 shadow-sm">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>{t("market.priceHistory") || "Price History (2025)"}</CardTitle>
                                    <CardDescription>
                                        <Badge variant="secondary" className="mr-2">
                                            {timeRange === '1m' ? (t("market.daily") || 'Daily') : (t("market.monthly") || 'Monthly')}
                                        </Badge>
                                        {t("market.analysisFor") || 'Analysis for'} {t(`crop.${selectedCrop.toLowerCase()}`) || selectedCrop}
                                    </CardDescription>
                                </div>
                                <Tabs value={timeRange} onValueChange={setTimeRange} className="w-[200px]">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="1m">1M</TabsTrigger>
                                        <TabsTrigger value="6m">6M</TabsTrigger>
                                        <TabsTrigger value="1y">1Y</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={isPositive ? "#16a34a" : "#dc2626"} stopOpacity={0.8} />
                                            <stop offset="95%" stopColor={isPositive ? "#16a34a" : "#dc2626"} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis
                                        dataKey={timeRange === '1m' ? 'date' : 'month'}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke={isPositive ? "#16a34a" : "#dc2626"}
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorPrice)"
                                        animationDuration={1000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>


        </div>
    );
}
