"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Define the shape of the profile data
export interface UserProfile {
    name: string;
    location: string;
    farmingType: string;
    avatarUrl?: string; // Optional
}

interface ProfileContextType {
    profile: UserProfile | null;
    saveProfile: (profile: UserProfile) => void;
    clearProfile: () => void;
    isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load profile from localStorage on mount
    useEffect(() => {
        const storedProfile = localStorage.getItem("userProfile");
        if (storedProfile) {
            try {
                setProfile(JSON.parse(storedProfile));
            } catch (error) {
                console.error("Failed to parse profile from localStorage", error);
            }
        }
        setIsLoading(false);
    }, []);

    const saveProfile = (newProfile: UserProfile) => {
        setProfile(newProfile);
        localStorage.setItem("userProfile", JSON.stringify(newProfile));
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
