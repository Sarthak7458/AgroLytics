const axios = require('axios');

async function test() {
    try {
        const response = await axios.post('http://localhost:5000/api/chat', {
            crop: "Wheat",
            context: {
                profit: 20000,
                risk: "Low",
                season: "Rabi"
            }
        });
        console.log("Response:", response.data);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

test();
