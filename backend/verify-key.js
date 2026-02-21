const axios = require('axios');

async function test() {
    try {
        console.log("Testing API Key...");
        const res = await axios.post('http://localhost:5000/api/chat', {
            crop: "Wheat",
            context: { profit: 25000, risk: "Low", season: "Rabi" },
            question: "Why this crop?"
        });

        // Check if response is from LLM or Fallback
        const response = res.data.response;
        console.log("Response:", response);

        // The fallback has a specific specific phrasing "Great question! I recommend..." 
        // Real LLM usually varies.
        // My fallback logic also checks keywords. "Why this crop?" -> generic fallback or LLM.

        if (response.includes("Great question! I recommend") && response.includes("safe bet for your land")) {
            console.log("NOTE: This looks like the fallback response.");
        } else {
            console.log("SUCCESS: Received a custom LLM response.");
        }

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

test();
