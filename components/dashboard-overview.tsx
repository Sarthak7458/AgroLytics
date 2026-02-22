'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { TrendingUp, Leaf, Droplets, Sprout, MapPin, ArrowUpRight, ArrowDownRight, Bug, CloudRain, AlertTriangle, Calendar, Sun, ArrowRight } from 'lucide-react'
import { useProfile } from '@/app/context/profile-context'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Using CSS variables from globals.css for theming
const COLORS = [
    'oklch(0.45 0.15 145)', // --primary
    'oklch(0.55 0.12 145)', // --accent
    'oklch(0.75 0.15 85)',  // --warning
    'oklch(0.55 0.2 25)'    // --danger
]

const DEFAULT_CHART_COLORS = ['#16a34a', '#2563eb', '#ea580c', '#eab308', '#8b5cf6']

const SEASON_MAP: Record<string, { name: string, period: string }> = {
    kharif: { name: "Kharif Season", period: "June - October" },
    rabi: { name: "Rabi Season", period: "October - March" },
    zaid: { name: "Zaid Season", period: "March - June" }
};

// --- Mock Market Data Generation (Ported from Market page) ---
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

        const baseItem: any = { price: Math.round(current) };
        if (type === 'daily') {
            baseItem.date = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        } else {
            baseItem.month = date.toLocaleDateString('en-US', { month: 'short' });
        }
        data.push(baseItem);
    }
    return data;
};

const getInitialMarketData = (cropName: string) => {
    const bases: Record<string, number> = { "Wheat": 2550, "Rice": 4200, "Cotton": 7800, "Sugarcane": 355, "Tomato": 3500, "Onion": 2200, "Potato": 1500, "Maize": 2300, "Soybean": 4800, "Turmeric": 13500 };
    const basePrice = bases[cropName] || 2500;
    const history6M = generateHistory(basePrice, basePrice * 0.05, 6, 'monthly');
    return { crop: cropName, price: basePrice, trend: (Math.random() * 10) - 3, history: history6M };
};

// --- Mock Risk Analysis (Ported from Risk Analysis page) ---
const cropSeasons: Record<string, number[]> = {
    "Wheat": [9, 10, 11], // Oct-Dec (Rabi)
    "Rice": [5, 6, 7],    // June-Aug (Kharif)
    "Cotton": [4, 5, 6],  // May-July
    "Sugarcane": [0, 1, 2, 9, 10], // Jan-Mar or Oct-Nov
    "Tomato": [0, 1, 5, 6, 7, 8, 9, 10],
    "Onion": [5, 6, 9, 10, 0, 1],
};

const monthToNum: Record<string, number> = {
    "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
    "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
};

const analyzeRisk = (crop: string, month: string) => {
    let weatherRisk = { level: "Low", score: 30, message: "Favorable weather predicted." };
    let marketRisk = { level: "Medium", score: 50, message: "Moderate price fluctuation expected." };
    let diseaseRisk = { level: "Low", score: 20, message: "Standard prevention required." };
    let overallRisk = "Low";

    const monthNum = monthToNum[month] || 0;

    if (cropSeasons[crop] && !cropSeasons[crop].includes(monthNum)) {
        weatherRisk = { level: "High", score: 85, message: `High stress conditions for ${crop}.` };
        diseaseRisk = { level: "High", score: 75, message: "Increased susceptibility to pests." };
    }

    if (crop === "Tomato" || crop === "Onion") {
        marketRisk = { level: "High", score: 85, message: "High price volatility historically." };
    }

    const avgScore = (weatherRisk.score + marketRisk.score + diseaseRisk.score) / 3;
    if (avgScore > 70) overallRisk = "High";
    else if (avgScore > 40) overallRisk = "Medium";

    return { weatherRisk, marketRisk, diseaseRisk, overallRisk, avgScore };
};

export function DashboardOverview() {
    const { profile } = useProfile()
    const [latestRec, setLatestRec] = useState<any>(null)
    const [khetDetails, setKhetDetails] = useState<any>(null)
    const [isLoadingRec, setIsLoadingRec] = useState(true)

    // Dynamic Chart States
    const [yieldTrendData, setYieldTrendData] = useState<any[]>([])
    const [cropDistributionData, setCropDistributionData] = useState<any[]>([])
    const [vegetationData, setVegetationData] = useState<any[]>([])
    const [rainfallYieldData, setRainfallYieldData] = useState<any[]>([])

    // Market & Risk States
    const [marketData, setMarketData] = useState<any>(null);
    const [dashboardRisk, setDashboardRisk] = useState<any>(null);
    const [dashboardSeason, setDashboardSeason] = useState<any>(null);
    useEffect(() => {
        const fetchLatestRecommendation = async () => {
            if (!profile?.id) {
                setIsLoadingRec(false)
                generateChartData(null) // Load default charts
                return
            }

            try {
                const { data, error } = await supabase
                    .from('recommendations')
                    .select('*')
                    .eq('farmer_id', profile.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()

                if (data && !error) {
                    setLatestRec(data)
                }
            } catch (err) {
                console.error("Failed to fetch recommendation", err)
            } finally {
                setIsLoadingRec(false)
            }
        }

        const fetchKhetDetails = () => {
            try {
                const storedDetails = localStorage.getItem("khetDetails")
                if (storedDetails) {
                    const parsed = JSON.parse(storedDetails)
                    setKhetDetails(parsed)
                    generateChartData(parsed)

                    // Derive crop for market data based on season/location
                    let marketCrop = "Wheat";
                    const loc = parsed.location ? parsed.location.toLowerCase() : "";
                    const season = parsed.season ? parsed.season.toLowerCase() : "";

                    if (season === "kharif" || loc.includes("south")) marketCrop = "Rice";
                    else if (loc.includes("west")) marketCrop = "Cotton";
                    else if (loc.includes("central")) marketCrop = "Soybean";

                    setMarketData(getInitialMarketData(marketCrop));

                    // Derive a dummy month for the risk analysis based on season
                    let sowingMonth = "July"; // Default Kharif
                    if (season === "rabi") sowingMonth = "November";
                    else if (season === "zaid") sowingMonth = "April";

                    setDashboardRisk(analyzeRisk(marketCrop, sowingMonth));

                    let seasonKey = season || "kharif";
                    if (!SEASON_MAP[seasonKey]) seasonKey = "kharif";
                    setDashboardSeason(SEASON_MAP[seasonKey]);

                } else {
                    generateChartData(null)
                    setMarketData(getInitialMarketData("Wheat"));
                    setDashboardRisk(analyzeRisk("Wheat", "November"));
                    setDashboardSeason(SEASON_MAP["rabi"]);
                }
            } catch (err) {
                console.error("Failed to parse khet details", err)
                generateChartData(null)
                setMarketData(getInitialMarketData("Wheat"));
                setDashboardRisk(analyzeRisk("Wheat", "November"));
                setDashboardSeason(SEASON_MAP["rabi"]);
            }
        }

        const generateChartData = (details: any) => {
            // Default Baseline Parameters
            let baseYield = 10
            let crops = [
                { name: 'Wheat', value: 35 },
                { name: 'Rice', value: 30 },
                { name: 'Corn', value: 20 },
                { name: 'Cotton', value: 15 },
            ]
            let ndviBase = 0.65
            let rainFallMultiplier = 1

            if (details) {
                // Land size scales yield (Assume 1.5 tons per acre on avg, random variance)
                const acres = parseFloat(details.landSize) || 5;
                baseYield = acres * 1.5;

                // Location determines crops
                const loc = details.location?.toLowerCase() || "";
                if (loc.includes("north")) crops = [{ name: 'Wheat', value: 40 }, { name: 'Mustard', value: 30 }, { name: 'Sugarcane', value: 30 }];
                else if (loc.includes("south")) crops = [{ name: 'Rice', value: 45 }, { name: 'Cotton', value: 35 }, { name: 'Spices', value: 20 }];
                else if (loc.includes("east")) crops = [{ name: 'Rice', value: 50 }, { name: 'Jute', value: 30 }, { name: 'Tea', value: 20 }];
                else if (loc.includes("west")) crops = [{ name: 'Cotton', value: 40 }, { name: 'Groundnut', value: 35 }, { name: 'Bajra', value: 25 }];
                else if (loc.includes("central")) crops = [{ name: 'Soybean', value: 40 }, { name: 'Wheat', value: 35 }, { name: 'Gram', value: 25 }];

                // Season affects rainfall
                const season = details.season?.toLowerCase() || "";
                if (season.includes("kharif")) rainFallMultiplier = 3.5; // High monsoon rain
                else if (season.includes("rabi")) rainFallMultiplier = 0.8; // Low winter rain
                else if (season.includes("zaid")) rainFallMultiplier = 0.2; // Very little summer rain

                // Irrigation affects NDVI
                const irrigation = details.irrigationType?.toLowerCase() || "";
                if (irrigation.includes("irrigated") || irrigation.includes("drip") || irrigation.includes("tubewell")) {
                    ndviBase = 0.80; // Healthier, stable
                } else if (irrigation.includes("rainfed")) {
                    ndviBase = 0.45; // Relies on monsoon, more volatile
                }
            }

            // 1. Yield Trend Data
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            setYieldTrendData(months.map((m, i) => ({
                name: m,
                yield: Math.max(0, parseFloat((baseYield * (0.8 + Math.random() * 0.4)).toFixed(1))),
                target: Math.max(0, parseFloat((baseYield * 1.1).toFixed(1))) // Target is always 10% higher than average baseline
            })));

            // 2. Crop Distribution Data
            setCropDistributionData(crops);

            // 3. Vegetation Health (NDVI)
            setVegetationData([1, 2, 3, 4, 5, 6].map(week => ({
                name: `Week ${week}`,
                value: Math.min(1.0, Math.max(0.1, parseFloat((ndviBase + (Math.random() * 0.2 - 0.1)).toFixed(2))))
            })));

            // 4. Rainfall vs Yield
            setRainfallYieldData(months.map((m) => {
                const rain = Math.max(0, Math.floor(40 * rainFallMultiplier * (0.5 + Math.random())));
                return {
                    name: m,
                    rainfall: rain,
                    yield: Math.max(0, parseFloat((baseYield * (0.7 + (rain / 200) + Math.random() * 0.2)).toFixed(1)))
                }
            }));
        }

        fetchLatestRecommendation()
        fetchKhetDetails()
    }, [profile?.id])



    return (
        <div className="space-y-6 mt-16 pb-12">

            {/* Personalized Welcome Section */}
            <div className="mb-8 pl-1">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-green-900 dark:text-green-400 mb-2">
                    Welcome back{profile?.name ? `, ${profile.name}` : ''}! 🌾
                </h2>
                <p className="text-muted-foreground text-lg">
                    Here is an overview of your farm's performance and recent recommendations.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <Card className="col-span-1 border border-green-100 dark:border-green-900/40 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 dark:bg-green-400/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between items-center">
                            <span>LATEST AI RECOMMENDATION</span>
                            <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-full text-green-700 dark:text-green-400">
                                <Leaf className="h-4 w-4" />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingRec ? (
                            <div className="text-sm text-muted-foreground animate-pulse">Checking latest data...</div>
                        ) : latestRec && latestRec.response ? (
                            <div className="flex flex-col gap-2">
                                <div className="text-2xl font-bold text-green-700 dark:text-green-500 capitalize">
                                    {latestRec.response.recommended || "N/A"}
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    {latestRec.response.confidence && (
                                        <Badge variant="outline" className="bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                                            {latestRec.response.confidence}% Match
                                        </Badge>
                                    )}
                                    {latestRec.response.expected_yield && (
                                        <span className="text-muted-foreground flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" /> {latestRec.response.expected_yield} Expected
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-900/50">
                                    <p className="text-sm text-amber-800 dark:text-amber-400 font-medium mb-1 flex items-center gap-1.5">
                                        <Leaf className="w-3.5 h-3.5" /> Quick Tip
                                    </p>
                                    <p className="text-xs text-amber-700/80 dark:text-amber-500/80 leading-relaxed">
                                        For optimal yields, rotate crops to maintain soil health. Consider planting nitrogen-fixing legumes before heavy feeders like corn or wheat.
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-xs italic">Need a personalized plan?</span>
                                    <Link href="/advisor">
                                        <Badge variant="secondary" className="hover:bg-green-100 cursor-pointer shadow-sm text-xs py-1">Get AI Advice →</Badge>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1 border border-blue-100 dark:border-blue-900/40 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between items-center">
                            <span>MY KHET (FARM DETAILS)</span>
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-700 dark:text-blue-400">
                                <MapPin className="h-4 w-4" />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {khetDetails ? (
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Location</p>
                                    <p className="font-medium text-foreground capitalize">{khetDetails.location || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Land Size</p>
                                    <p className="font-medium text-foreground text-blue-700 dark:text-blue-400">{khetDetails.landSize ? `${khetDetails.landSize} Acres` : "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Season</p>
                                    <p className="font-medium text-foreground capitalize">{khetDetails.season || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Irrigation</p>
                                    <p className="font-medium text-foreground capitalize">{khetDetails.irrigationType || "N/A"}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <span className="text-muted-foreground text-sm italic">No farm details found.</span>
                                <Link href="/khet-details">
                                    <Badge variant="secondary" className="hover:bg-blue-100 cursor-pointer text-blue-700">Add Farm Details →</Badge>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Yield Trend */}
                <Card className="p-6 border-border flex flex-col hover:shadow-md transition-shadow">
                    <h3 className="font-sans font-semibold text-lg mb-4 text-foreground">Yield Trend</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={yieldTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.5} stroke="var(--border)" />
                                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="yield" stroke="oklch(0.45 0.15 145)" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="target" stroke="oklch(0.5 0.02 140)" strokeDasharray="5 5" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Crop Distribution */}
                <Card className="p-6 border-border flex flex-col hover:shadow-md transition-shadow">
                    <h3 className="font-sans font-semibold text-lg mb-4 text-foreground">Crop Distribution</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={cropDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name} ${value}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {cropDistributionData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Market Trend Extension as a Card */}
                {marketData && (
                    <Card className="p-6 border-border flex flex-col hover:shadow-md transition-shadow">
                        <h3 className="font-sans font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-500" />
                            Market Trend: {marketData.crop}
                        </h3>
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Current Price</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-foreground">₹{Math.floor(marketData.price).toLocaleString()}</span>
                                        <span className="text-xs font-medium text-muted-foreground">/ quintal</span>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 ${marketData.trend >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                                    {marketData.trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    <span className="font-bold text-base">{Math.abs(marketData.trend).toFixed(1)}%</span>
                                    <span className="text-muted-foreground text-xs ml-1 hidden sm:inline">past 6 mo</span>
                                </div>
                            </div>
                            <div className="flex-1 min-h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={marketData.history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorMarketPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={marketData.trend >= 0 ? "#16a34a" : "#dc2626"} stopOpacity={0.8} />
                                                <stop offset="95%" stopColor={marketData.trend >= 0 ? "#16a34a" : "#dc2626"} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} stroke="var(--border)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                                        <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="var(--muted-foreground)" domain={['auto', 'auto']} width={40} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke={marketData.trend >= 0 ? "#16a34a" : "#dc2626"}
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorMarketPrice)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Current Season Extension as a Card */}
                {dashboardSeason && (
                    <Card className="p-6 border-border flex flex-col hover:shadow-md transition-shadow">
                        <h3 className="font-sans font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                            Current Season
                        </h3>
                        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-100 dark:border-yellow-900/50">
                            <Sun className="w-12 h-12 text-yellow-500 mb-4" />
                            <h4 className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">{dashboardSeason.name}</h4>
                            <span className="px-4 py-1.5 bg-white dark:bg-card text-yellow-800 dark:text-yellow-400 font-semibold rounded-full shadow-sm text-sm border border-yellow-200 dark:border-yellow-800">
                                {dashboardSeason.period}
                            </span>
                            <Link href="/seasons" className="mt-8 text-sm flex items-center gap-1 text-muted-foreground hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors font-medium">
                                View Crop Guide <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </Card>
                )}
            </div>

            {/* Risk Analysis Extension */}
            {dashboardRisk && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6 flex items-center gap-2">
                        <AlertTriangle className={`w-6 h-6 ${dashboardRisk.overallRisk === "High" ? "text-red-500" : dashboardRisk.overallRisk === "Medium" ? "text-orange-500" : "text-green-500"}`} />
                        Risk Analysis
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Weather Risk */}
                        <Card className="border-border shadow-sm flex flex-col p-5">
                            <h3 className="text-sm font-medium flex items-center gap-2 mb-2 text-muted-foreground uppercase tracking-wider">
                                <CloudRain className="w-4 h-4 text-blue-500" /> Weather Risk
                            </h3>
                            <div className="text-3xl font-bold mb-1">{dashboardRisk.weatherRisk.level}</div>
                            <p className="text-sm text-foreground mb-4">{dashboardRisk.weatherRisk.message}</p>
                            <div className="w-full bg-blue-100 dark:bg-blue-900/30 h-2 mt-auto rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${dashboardRisk.weatherRisk.score}%` }}></div>
                            </div>
                        </Card>

                        {/* Market Risk */}
                        <Card className="border-border shadow-sm flex flex-col p-5">
                            <h3 className="text-sm font-medium flex items-center gap-2 mb-2 text-muted-foreground uppercase tracking-wider">
                                <TrendingUp className="w-4 h-4 text-green-500" /> Market Risk
                            </h3>
                            <div className="text-3xl font-bold mb-1">{dashboardRisk.marketRisk.level}</div>
                            <p className="text-sm text-foreground mb-4">{dashboardRisk.marketRisk.message}</p>
                            <div className="w-full bg-green-100 dark:bg-green-900/30 h-2 mt-auto rounded-full overflow-hidden">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${dashboardRisk.marketRisk.score}%` }}></div>
                            </div>
                        </Card>

                        {/* Disease Risk */}
                        <Card className="border-border shadow-sm flex flex-col p-5">
                            <h3 className="text-sm font-medium flex items-center gap-2 mb-2 text-muted-foreground uppercase tracking-wider">
                                <Bug className="w-4 h-4 text-red-500" /> Disease Risk
                            </h3>
                            <div className="text-3xl font-bold mb-1">{dashboardRisk.diseaseRisk.level}</div>
                            <p className="text-sm text-foreground mb-4">{dashboardRisk.diseaseRisk.message}</p>
                            <div className="w-full bg-red-100 dark:bg-red-900/30 h-2 mt-auto rounded-full overflow-hidden">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${dashboardRisk.diseaseRisk.score}%` }}></div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
