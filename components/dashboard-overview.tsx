'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Leaf, Droplets, Sprout } from 'lucide-react'
import { useProfile } from '@/app/context/profile-context'
import { supabase } from '@/lib/supabase'

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

        fetchLatestRecommendation()
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
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    Welcome back, {profile?.name || 'Farmer'}! 🌾
                </h2>
                <p className="text-muted-foreground mb-6">Here is an overview of your farm's performance and recent recommendations.</p>

                {/* Recommendation Highlight */}
                <Card className="p-6 bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full">
                            <Sprout className="w-6 h-6 text-green-700 dark:text-green-300" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-green-900 dark:text-green-100 mb-1">
                                Latest AI Recommendation
                            </h3>
                            {isLoadingRec ? (
                                <p className="text-sm text-muted-foreground animate-pulse">Checking latest data...</p>
                            ) : latestRec ? (
                                <div className="space-y-1">
                                    <p className="text-foreground">
                                        Based on your last scan, we recommend planting <span className="font-bold text-green-700 dark:text-green-400">{latestRec.recommended_crop}</span>.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Expected Profit: <span className="font-medium">₹{latestRec.expected_profit?.toLocaleString() || 'N/A'}</span> • Risk Level: <span className="font-medium">{latestRec.risk_level || 'Medium'}</span>
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">You haven't generated any crop recommendations recently. Go to the Recommendation tab to get started!</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="text-center mb-8 pt-6 border-t border-border">
                <h2 className="text-2xl font-bold text-foreground mb-2">Platform Overview</h2>
                <p className="text-muted-foreground text-sm">Aggregated data and trends across your farm</p>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6 border-border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Yield</p>
                            <p className="font-sans font-bold text-2xl text-foreground">45.2 T</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-primary opacity-70" />
                    </div>
                    <p className="text-xs text-primary font-medium">↑ 12% from last season</p>
                </Card>

                <Card className="p-6 border-border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Average Yield/Acre</p>
                            <p className="font-sans font-bold text-2xl text-foreground">42.5 T</p>
                        </div>
                        <Leaf className="h-8 w-8 text-primary opacity-70" />
                    </div>
                    <p className="text-xs text-primary font-medium">↑ 8% from target</p>
                </Card>

                <Card className="p-6 border-border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">NDVI Score</p>
                            <p className="font-sans font-bold text-2xl text-foreground">0.82</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-accent opacity-70" />
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Healthy vegetation</p>
                </Card>

                <Card className="p-6 border-border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Water Usage</p>
                            <p className="font-sans font-bold text-2xl text-foreground">1,240 mm</p>
                        </div>
                        <Droplets className="h-8 w-8 text-accent opacity-70" />
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Optimized usage</p>
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
