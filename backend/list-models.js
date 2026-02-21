require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
    try {
        // Unfortunately the Node SDK doesn't have a direct listModels helper exposed on the main class easily 
        // in some versions, but let's try getGenerativeModel with a wild guess or check documentation memory.
        // Actually, the SDK is for inference.
        // Let's just try running a generation with 'gemini-1.5-flash' again and catch the full error object 
        // to see if it lists models in the error message, as the previous error text suggested.

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test");
        console.log("Success with gemini-1.5-flash");
    } catch (error) {
        console.error("Error with gemini-1.5-flash:", error.message);
        try {
            const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result2 = await model2.generateContent("Test");
            console.log("Success with gemini-pro");
        } catch (error2) {
            console.error("Error with gemini-pro:", error2.message);
        }
    }
}

listModels();
