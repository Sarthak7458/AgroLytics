"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Define the shape of the profile data — matches the Supabase `farmers` table
export interface UserProfile {
    id?: string;          // UUID from Supabase
    name: string;
    phone: string;
    email?: string;
    village?: string;
    district?: string;
    state: string;
    farmingType: string;  // kept for local use, not a DB column
    avatarUrl?: string;
}

interface ProfileContextType {
    profile: UserProfile | null;
    saveProfile: (profile: UserProfile) => Promise<void>;
    clearProfile: () => void;
    isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load profile from localStorage on mount, then try Supabase
    useEffect(() => {
        const loadProfile = async () => {
            // First check localStorage for quick load
            const storedProfile = localStorage.getItem("userProfile");
            if (storedProfile) {
                try {
                    const parsed = JSON.parse(storedProfile);
                    setProfile(parsed);

                    // If we have a Supabase ID, refresh from DB
                    if (parsed.id) {
                        const { data } = await supabase
                            .from("farmers")
                            .select("*")
                            .eq("id", parsed.id)
                            .single();

                        if (data) {
                            const refreshed: UserProfile = {
                                id: data.id,
                                name: data.name,
                                phone: data.phone,
                                email: data.email || "",
                                village: data.village || "",
                                district: data.district || "",
                                state: data.state,
                                farmingType: parsed.farmingType || "",
                            };
                            setProfile(refreshed);
                            localStorage.setItem("userProfile", JSON.stringify(refreshed));
                        }
                    }
                } catch (error) {
                    console.error("Failed to parse profile from localStorage", error);
                }
            }
            setIsLoading(false);
        };

        loadProfile();
    }, []);

    const saveProfile = async (newProfile: UserProfile) => {
        try {
            // Save to Supabase `farmers` table
            const farmerRow: any = {
                name: newProfile.name,
                phone: newProfile.phone,
                state: newProfile.state,
            };

            // Only add optional fields if they have values to avoid schema errors for missing columns
            if (newProfile.email) farmerRow.email = newProfile.email;
            if (newProfile.village) farmerRow.village = newProfile.village;
            if (newProfile.district) farmerRow.district = newProfile.district;

            let data = null;
            let error = null;

            if (newProfile.id) {
                // Update existing farmer
                const result = await supabase
                    .from("farmers")
                    .update(farmerRow)
                    .eq("id", newProfile.id)
                    .select()
                    .single();
                data = result.data;
                error = result.error;
            } else {
                // Insert new farmer
                const result = await supabase
                    .from("farmers")
                    .insert(farmerRow)
                    .select()
                    .single();
                data = result.data;
                error = result.error;
            }

            if (error) {
                console.error("Supabase save error:", error.message, "Code:", error.code, "Details:", error.details, "Hint:", error.hint);
                // Still save locally even if Supabase fails
            }

            const profileToSave: UserProfile = {
                ...newProfile,
                id: data?.id || newProfile.id,
            };

            setProfile(profileToSave);
            localStorage.setItem("userProfile", JSON.stringify(profileToSave));
        } catch (err) {
            console.error("Error saving profile:", err);
            // Fallback: save locally anyway
            setProfile(newProfile);
            localStorage.setItem("userProfile", JSON.stringify(newProfile));
        }
    };

    const clearProfile = () => {
        setProfile(null);
        localStorage.removeItem("userProfile");
    };

    return (
        <ProfileContext.Provider value={{ profile, saveProfile, clearProfile, isLoading }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
}
