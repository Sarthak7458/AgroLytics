"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile, UserProfile } from "../context/profile-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Sprout, MapPin, User, CheckCircle2, Phone, Mail, Building } from "lucide-react";
import { useLanguage } from "@/app/context/language-context";

export default function CreateProfilePage() {
    const router = useRouter();
    const { saveProfile } = useProfile();
    const [formData, setFormData] = useState<UserProfile>({
        name: "",
        phone: "",
        email: "",
        village: "",
        district: "",
        state: "",
        farmingType: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useLanguage();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        await saveProfile(formData);
        router.push("/profile");
        setIsSubmitting(false);
    };

    const indianStates = [
        "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
        "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950/30 dark:to-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <Card className="border-none shadow-xl bg-white/90 dark:bg-card/90 backdrop-blur-sm">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-2">
                            <User className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-green-900 dark:text-green-100">{t("createProfile.title")}</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-muted-foreground">
                            {t("createProfile.subtitle")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700 dark:text-foreground flex items-center gap-2">
                                    <User className="w-4 h-4 text-green-600 dark:text-green-400" /> {t("createProfile.fullName")}
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder={t("createProfile.namePlaceholder")}
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="border-green-100 dark:border-green-800 focus:border-green-500 focus:ring-green-500 bg-green-50/30 dark:bg-green-950/20"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-gray-700 dark:text-foreground flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-green-600 dark:text-green-400" /> Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="border-green-100 dark:border-green-800 focus:border-green-500 focus:ring-green-500 bg-green-50/30 dark:bg-green-950/20"
                                />
                            </div>

                            {/* Email (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 dark:text-foreground flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-green-600 dark:text-green-400" /> Email (Optional)
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border-green-100 dark:border-green-800 focus:border-green-500 focus:ring-green-500 bg-green-50/30 dark:bg-green-950/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Village (Optional) */}
                                <div className="space-y-2">
                                    <Label htmlFor="village" className="text-gray-700 dark:text-foreground flex items-center gap-2">
                                        <Building className="w-4 h-4 text-green-600 dark:text-green-400" /> Village
                                    </Label>
                                    <Input
                                        id="village"
                                        name="village"
                                        placeholder="Village name"
                                        value={formData.village}
                                        onChange={handleChange}
                                        className="border-green-100 dark:border-green-800 focus:border-green-500 focus:ring-green-500 bg-green-50/30 dark:bg-green-950/20"
                                    />
                                </div>

                                {/* District (Optional) */}
                                <div className="space-y-2">
                                    <Label htmlFor="district" className="text-gray-700 dark:text-foreground flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" /> District
                                    </Label>
                                    <Input
                                        id="district"
                                        name="district"
                                        placeholder="District name"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="border-green-100 dark:border-green-800 focus:border-green-500 focus:ring-green-500 bg-green-50/30 dark:bg-green-950/20"
                                    />
                                </div>
                            </div>

                            {/* State */}
                            <div className="space-y-2">
                                <Label htmlFor="state" className="text-gray-700 dark:text-foreground flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" /> State
                                </Label>
                                <Select onValueChange={(value) => handleSelectChange("state", value)} required>
                                    <SelectTrigger className="border-green-100 dark:border-green-800 focus:ring-green-500 bg-green-50/30 dark:bg-green-950/20">
                                        <SelectValue placeholder="Select your state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {indianStates.map((st) => (
                                            <SelectItem key={st} value={st}>{st}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Farming Type */}
                            <div className="space-y-2">
                                <Label htmlFor="farmingType" className="text-gray-700 dark:text-foreground flex items-center gap-2">
                                    <Sprout className="w-4 h-4 text-green-600 dark:text-green-400" /> {t("createProfile.farmingType")}
                                </Label>
                                <Select onValueChange={(value) => handleSelectChange("farmingType", value)} required>
                                    <SelectTrigger className="border-green-100 dark:border-green-800 focus:ring-green-500 bg-green-50/30 dark:bg-green-950/20">
                                        <SelectValue placeholder={t("createProfile.selectType")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="organic">{t("createProfile.organic")}</SelectItem>
                                        <SelectItem value="conventional">{t("createProfile.conventional")}</SelectItem>
                                        <SelectItem value="mixed">{t("createProfile.mixed")}</SelectItem>
                                        <SelectItem value="hydroponics">{t("createProfile.hydroponics")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 animate-spin" /> {t("createProfile.saving")}
                                    </span>
                                ) : (
                                    t("createProfile.submit")
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-xs text-center text-gray-500 dark:text-muted-foreground">
                            {t("createProfile.dataNotice")}
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
