const pricesData = require('../data/prices.json');
const axios = require('axios');

const cache = {
    prices: {},
    timestamp: 0
};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Calculates a demand score (0-1) for a crop.
 * @param {string} cropId 
 * @returns {number} demandScore
 */
/**
 * Simulates a live market check.
 * Returns { price, trend }
 */
const getMarketData = (cropId) => {
    const staticData = pricesData[cropId];
    if (!staticData) return { price: 0, trend: 'stable', isLiveData: false };

    // In a real scenario, we would fetch from an API here.
    // For now, we return the static dataset value as the "Base Market Price".
    // If we had a live API, we'd try that first, and set isLiveData = true.

    // Check if we have a valid API key (Simulated check)
    // const hasApiKey = process.env.MARKET_DATA_API_KEY; 
    // if (hasApiKey) { ... fetch live ... return { price: livePrice, trend: liveTrend, isLiveData: true } }

    return {
        price: staticData.currentPrice,
        trend: staticData.trend,
        isLiveData: false // Currently falling back to static dataset
    };
};

/**
 * Calculates a demand score (0-1) for a crop based on market data.
 * @param {string} trend 
 * @returns {number} demandScore
 */
const calculateDemandScore = async (trend) => {
    let score = 5; // Neutral start (0-10 scale)

    if (trend === 'up') score = 8;
    if (trend === 'stable') score = 5;
    if (trend === 'down') score = 2;

    return score;
};

module.exports = { calculateDemandScore, getMarketData };
