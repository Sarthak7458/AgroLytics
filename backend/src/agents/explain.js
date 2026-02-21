require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generates regular explanations (Legacy/Simple).
 */
const generateExplanation = (cropName, season, factors) => {
    return `${cropName} is a great choice for ${season}. ${factors.join('. ')}.`;
};

/**
 * Generates "Chatbot" style explanations using LLM.
 */
const generateChatResponse = async (cropName, context, question) => {
    const { profit, risk, season } = context;

    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("GEMINI_API_KEY missing, using fallback.");
            throw new Error("No API Key");
        }

        const prompt = `
        You are a helpful, expert agricultural advisor assistant for Indian farmers.
        
        Context:
        - Crop: ${cropName}
        - Season: ${season}
        - Estimated Profit: ₹${profit}/acre
        - Risk Level: ${risk}

        User Question: "${question}"

        Task:
        Answer the user's question directly based on the context above.
        If the question is generic (e.g. "Why this crop?"), explain why it's a good choice.
        Keep it encouraging, simple to understand, and trustworthy. 
        Do not invent new facts, strictly use the provided context. 
        Keep the response under 3 sentences.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("LLM Error:", error.message);

        // Smart Fallback based on Question Keywords
        const q = (question || "").toLowerCase();

        if (q.includes("risk") || q.includes("safe")) {
            return `Regarding risks: ${cropName} is rated as ${risk} risk. This considers both weather and price stability for the ${season} season.`;
        }

        if (q.includes("profit") || q.includes("money") || q.includes("earn")) {
            return `For profit: We estimate you could earn around ₹${profit}/acre with ${cropName} this season, making it a financially sound choice.`;
        }

        if (q.includes("alternative") || q.includes("other")) {
            return `There are other options, but ${cropName} is the top recommendation for your specific land and season conditions right now.`;
        }

        // Default Persona
        return `Great question! I recommend ${cropName} because it gives a solid profit of ₹${profit}/acre. 
        It fits perfectly in the ${season} season. The risk is ${risk}, so it's a safe bet for your land.`;
    }
};

module.exports = { generateExplanation, generateChatResponse };
