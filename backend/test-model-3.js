require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent("Test");
        console.log("Success with gemini-1.5-pro");
    } catch (error) {
        console.error("Error with gemini-1.5-pro:", error.message);
    }
}

test();
