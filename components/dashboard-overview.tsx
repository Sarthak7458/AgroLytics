'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Leaf, Droplets, Sprout, MapPin } from 'lucide-react'
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
                } else {
                    generateChartData(null)
                }
            } catch (err) {
                console.error("Failed to parse khet details", err)
                generateChartData(null)
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
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <Card className="col-span-1 border-none shadow-sm flex flex-col justify-center items-start p-6 bg-gradient-to-br from-white to-green-50/50 dark:from-slate-900 dark:to-green-950/20">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-bold tracking-tight text-green-900 dark:text-green-400">
                            Welcome back{profile?.name ? `, ${profile.name}` : ''}! 🌾
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            Here is an overview of your farm's performance and recent recommendations.
                        </p>
                    </div>
                </Card>

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

                {/* NDVI Trend */}
                <Card className="p-6 border-border flex flex-col hover:shadow-md transition-shadow">
                    <h3 className="font-sans font-semibold text-lg mb-4 text-foreground">Vegetation Health (NDVI)</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={vegetationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.5} stroke="var(--border)" />
                                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                                />
                                <Bar dataKey="value" fill="oklch(0.45 0.15 145)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Rainfall vs Yield */}
                <Card className="p-6 border-border flex flex-col hover:shadow-md transition-shadow">
                    <h3 className="font-sans font-semibold text-lg mb-4 text-foreground">Rainfall vs Yield Correlation</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={rainfallYieldData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.5} stroke="var(--border)" />
                                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar yAxisId="left" dataKey="rainfall" fill="oklch(0.55 0.12 145)" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
                                <Bar yAxisId="right" dataKey="yield" fill="oklch(0.45 0.15 145)" radius={[4, 4, 0, 0]} name="Yield (T)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    )
}
