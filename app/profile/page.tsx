"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "../context/profile-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Sprout, User, Edit, LogOut, Phone, Mail, Building } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/context/language-context";

export default function ProfilePage() {
    const { profile, clearProfile, isLoading } = useProfile();
    const router = useRouter();
    const { t } = useLanguage();

    useEffect(() => {
        if (!isLoading && !profile) {
            router.push("/create-profile");
        }
    }, [profile, isLoading, router]);

    if (isLoading || !profile) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
        );
    }

    const handleLogout = () => {
        clearProfile();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border-none shadow-lg overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-500"></div>
                        <CardHeader className="relative pb-0 pt-0 px-6">
                            <div className="absolute -top-16 left-6 border-4 border-white rounded-full bg-white shadow-md">
                                <Avatar className="h-32 w-32">
                                    <AvatarImage src="/farmer-animated.png" alt={profile.name} className="object-cover" />
                                    <AvatarFallback className="text-4xl bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                                        {profile.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="ml-40 pt-4 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-foreground">{profile.name}</CardTitle>
                                    <p className="text-sm text-gray-500 dark:text-muted-foreground flex items-center mt-1">
                                        <MapPin className="w-4 h-4 mr-1 text-gray-400 dark:text-muted-foreground" /> {profile.state}
                                        {profile.district && `, ${profile.district}`}
                                    </p>
                                </div>
                                <div className="mt-4 sm:mt-0 flex gap-2">
                                    <Link href="/create-profile">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Edit className="w-4 h-4" /> {t("profile.editProfile")}
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </motion.div>

                {/* Details Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <Card className="shadow-md h-full">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <User className="w-5 h-5 text-green-600 dark:text-green-400" /> Personal Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-muted-foreground">Phone</p>
                                <p className="text-lg text-gray-900 dark:text-foreground font-medium flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-green-600" /> {profile.phone}
                                </p>
                            </div>
                            {profile.email && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-muted-foreground">Email</p>
                                    <p className="text-lg text-gray-900 dark:text-foreground font-medium flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-green-600" /> {profile.email}
                                    </p>
                                </div>
                            )}
                            {profile.village && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-muted-foreground">Village</p>
                                    <p className="text-lg text-gray-900 dark:text-foreground font-medium flex items-center gap-2">
                                        <Building className="w-4 h-4 text-green-600" /> {profile.village}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-md h-full">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" /> {t("profile.farmingDetails")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-muted-foreground">{t("profile.farmingType")}</p>
                                <p className="text-lg text-gray-900 dark:text-foreground capitalize font-medium">{profile.farmingType}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-muted-foreground">State</p>
                                <p className="text-lg text-gray-900 dark:text-foreground font-medium">{profile.state}</p>
                            </div>
                            {profile.district && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-muted-foreground">District</p>
                                    <p className="text-lg text-gray-900 dark:text-foreground font-medium">{profile.district}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* CTA Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Card className="shadow-md bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-800">
                        <CardContent className="py-6">
                            <p className="text-gray-700 dark:text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: t("profile.comparisonText") }} />
                            <Link href="/khet-details" className="w-full">
                                <Button className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 text-white">
                                    {t("profile.getCropRec")}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>

            </div>
        </div>
    );
}
