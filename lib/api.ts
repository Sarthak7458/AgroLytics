const API_URL = "http://localhost:5000/api";

export interface CropRecommendation {
    id: string;
    name: string;
    season: string[];
    irrigation: string[];
    minLandSize: number;
    yieldPerAcre: number;
    costPerAcre: number;
    description: string;
    demandScore: number;
    riskProfile: {
        level: "Low" | "Medium" | "High";
        factors: string[];
    };
    expectedProfit: number;
    marketPrice?: number;
    marketTrend?: "up" | "down" | "stable";
    finalScore: number;
    explanation: string;
    confidence: "High" | "Medium" | "Low";
}

export interface RecommendationResponse {
    recommended: CropRecommendation | null;
    alternatives: {
        id: string;
        name: string;
        expectedProfit: number;
        marketPrice?: number;
        marketTrend?: "up" | "down" | "stable";
        confidence: "High" | "Medium" | "Low";
        riskLevel: "Low" | "Medium" | "High";
    }[];
    message?: string;
}

export interface ChatResponse {
    response: string;
}

export const api = {
    getRecommendation: async (data: {
        location: string;
        season: string;
        landSize: number;
        irrigationType: string;
    }): Promise<RecommendationResponse> => {
        const response = await fetch(`${API_URL}/recommend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                location: data.location,
                season: data.season,
                landSize: data.landSize,
                irrigation: data.irrigationType,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch recommendation");
        }

        return response.json();
    },

    getChatExplanation: async (
        crop: string,
        context: { profit: number; risk: string; season: string },
        question?: string
    ): Promise<ChatResponse> => {
        // Note: The backend /chat endpoint currently only supports the initial context explanation.
        // If we want to support specific questions, we might need to update the backend or just use the generic response for now.
        // For this hackathon MVP, we will send the context and receive the persona response.

        // Using the same endpoint for both initial and follow-up for now, 
        // but effectively the backend just ignores the question and gives a robust answer based on context.
        const response = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                crop,
                context,
                question,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch chat explanation");
        }

        return response.json();
    },
};
