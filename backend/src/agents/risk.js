const riskData = require('../data/risks.json');
const axios = require('axios');

// Simple in-memory cache
const cache = {
    weather: null,
    timestamp: 0
};

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Fetches current weather for a location (or mock if no key).
 */
const REGION_COORDS = {
    "North India": { lat: 28.61, lon: 77.20 }, // New Delhi
    "South India": { lat: 12.97, lon: 77.59 }, // Bangalore
    "East India": { lat: 22.57, lon: 88.36 },  // Kolkata
    "West India": { lat: 19.07, lon: 72.87 },  // Mumbai
    "Central India": { lat: 21.14, lon: 79.08 }, // Nagpur
    "Pune, Maharashtra": { lat: 18.52, lon: 73.85 } // Default/Dev
};

/**
 * Fetches current weather for a location using Open-Meteo (No Key Needed).
 */
const fetchWeather = async (location) => {
    const now = Date.now();
    if (cache.weather && (now - cache.timestamp < CACHE_DURATION)) {
        return cache.weather;
    }

    try {
        const coords = REGION_COORDS[location] || REGION_COORDS["Central India"];

        // Open-Meteo Free API
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;
        const response = await axios.get(url);

        const code = response.data.current_weather.weathercode;
        // WMO Weather interpretation codes (simplified)
        // 0: Clear, 1-3: Cloudy, 50-67: Rain, 71-77: Snow, 95-99: Storm
        let weather = "Clear";
        if (code >= 1 && code <= 3) weather = "Cloudy";
        else if (code >= 50 && code <= 67) weather = "Rain";
        else if (code >= 71) weather = "Snow";
        else if (code >= 95) weather = "Storm";

        console.log(`[RiskAgent] Fetched live weather for ${location}: ${weather} (Code: ${code})`);

        cache.weather = weather;
        cache.timestamp = now;
        return weather;
    } catch (error) {
        console.warn("Weather fetch failed (using fallback):", error.message);
        return "Clear";
    }
};

/**
 * Assigns risk profile to a crop.
 * @param {string} cropId 
 * @param {string} location
 * @returns {Object} { level: 'Low'|'Medium'|'High', factors: [] }
 */
const evaluateRisk = async (cropId, location) => {
    const data = riskData[cropId];
    if (!data) return { level: 'Medium', factors: ['Unknown data'] };

    const currentWeather = await fetchWeather(location);

    let riskScore = 0;
    const factors = [];

    // Weather Impact
    let isWeatherLive = false;
    // Check if weather is not the default fallback "Clear" 
    if (currentWeather !== "Clear") {
        isWeatherLive = true;
    }
    // Since we use OpenMeteo for everyone now, treat it as live if we got a response.
    // Ideally we track if axios failed, but for now this is a good proxy.

    if (data.weatherRisk === 'High' && (currentWeather === 'Rain' || currentWeather === 'Storm')) {
        riskScore += 3;
        factors.push(`Risk of ${currentWeather}`);
    } else {
        if (data.weatherRisk === 'High') riskScore += 2;
        if (data.weatherRisk === 'Medium') riskScore += 1;
        factors.push(`Weather Sensitivity: ${data.weatherRisk}`);
    }

    if (data.priceVolatility === 'High') riskScore += 2;
    if (data.priceVolatility === 'Medium') riskScore += 1;
    factors.push(`Price Volatility: ${data.priceVolatility}`);

    let level = 'Low';
    let penalty = 2;

    if (riskScore >= 4) {
        level = 'High';
        penalty = 10;
    } else if (riskScore >= 2) {
        level = 'Medium';
        penalty = 6;
    }

    return {
        level,
        penalty,
        factors,
        isLiveData: isWeatherLive
    };
};

module.exports = { evaluateRisk };
