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

    useEffect(() => {
        const fetchLatestRecommendation = async () => {
            if (!profile?.id) {
                setIsLoadingRec(false)
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
                    setKhetDetails(JSON.parse(storedDetails))
                }
            } catch (err) {
                console.error("Failed to parse khet details", err)
            }
        }

        fetchLatestRecommendation()
        fetchKhetDetails()
    }, [profile?.id])

    const yieldTrendData = [
        { month: 'Jan', yield: 28, target: 30 },
        { month: 'Feb', yield: 32, target: 30 },
        { month: 'Mar', yield: 35, target: 35 },
        { month: 'Apr', yield: 38, target: 38 },
        { month: 'May', yield: 42, target: 40 },
        { month: 'Jun', yield: 45, target: 45 },
    ]

    const cropDistribution = [
        { name: 'Wheat', value: 35, color: COLORS[0] },
        { name: 'Rice', value: 30, color: COLORS[1] },
        { name: 'Corn', value: 20, color: COLORS[2] },
        { name: 'Cotton', value: 15, color: COLORS[3] },
    ]

    const ndviTrendData = [
        { date: 'Week 1', ndvi: 0.35 },
        { date: 'Week 2', ndvi: 0.42 },
        { date: 'Week 3', ndvi: 0.58 },
        { date: 'Week 4', ndvi: 0.68 },
        { date: 'Week 5', ndvi: 0.75 },
        { date: 'Week 6', ndvi: 0.82 },
    ]

    const rainfallVsYield = [
        { month: 'Jan', rainfall: 40, yield: 28 },
        { month: 'Feb', rainfall: 50, yield: 32 },
        { month: 'Mar', rainfall: 65, yield: 35 },
        { month: 'Apr', rainfall: 85, yield: 38 },
        { month: 'May', rainfall: 120, yield: 42 },
        { month: 'Jun', rainfall: 150, yield: 45 },
    ]

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
                            <div className="flex flex-col gap-2">
                                <span className="text-muted-foreground text-sm italic">No recent recommendations.</span>
                                <Link href="/advisor">
                                    <Badge variant="secondary" className="hover:bg-green-100 cursor-pointer">Get Advice →</Badge>
                                </Link>
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
                                    <p className="font-medium text-foreground">{khetDetails.city || "N/A"}, {khetDetails.state || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Land Size</p>
                                    <p className="font-medium text-foreground text-blue-700 dark:text-blue-400">{khetDetails.landSize ? `${khetDetails.landSize} Acres` : "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Soil Type</p>
                                    <p className="font-medium text-foreground capitalize">{khetDetails.soilType || "N/A"}</p>
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
                                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
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
                                    data={cropDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name} ${value}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {cropDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                            <BarChart data={ndviTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.5} stroke="var(--border)" />
                                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                                />
                                <Bar dataKey="ndvi" fill="oklch(0.45 0.15 145)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Rainfall vs Yield */}
                <Card className="p-6 border-border flex flex-col hover:shadow-md transition-shadow">
                    <h3 className="font-sans font-semibold text-lg mb-4 text-foreground">Rainfall vs Yield Correlation</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={rainfallVsYield} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.5} stroke="var(--border)" />
                                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
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
