const http = require('http');

const postRequest = (path, data) => {
    const dataString = JSON.stringify(data);
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        }
    };

    const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
            responseData += chunk;
        });
        res.on('end', () => {
            console.log(`\nResponse from ${path}:`);
            console.log(JSON.stringify(JSON.parse(responseData), null, 2));
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    req.write(dataString);
    req.end();
};

// Test 1: Get Recommendation
console.log("Testing /recommend...");
postRequest('/api/recommend', {
    season: 'Winter',
    landSize: 5,
    irrigation: 'Canal'
});

// Test 2: Get Chat Explanation
setTimeout(() => {
    console.log("\nTesting /chat...");
    postRequest('/api/chat', {
        crop: 'Wheat',
        context: {
            profit: 12000,
            risk: 'Low',
            season: 'Winter'
        }
    });
}, 1000);
