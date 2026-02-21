const cropsData = require('../data/crops.json');
const pricesData = require('../data/prices.json');

/**
 * Calculates estimated profit per acre.
 * @param {string} cropId 
 * @returns {number} estimatedProfit
 */
const calculateProfit = (cropId, currentPrice) => {
    const crop = cropsData.find(c => c.id === cropId);

    // If no dynamic price provided, fallback to static (though Orchestrator should provide it)
    const price = currentPrice || (pricesData[cropId] ? pricesData[cropId].currentPrice : 0);

    if (!crop || !price) return { raw: 0, normalized: 0 };

    const revenue = crop.yieldPerAcre * price;
    const profit = revenue - crop.costPerAcre;

    // Normalize: Goal is 0-50 points.
    // Assume 50,000 profit = 50 points.
    const normalized = Math.min(Math.max(profit / 1000, 0), 50);

    return {
        raw: profit,
        normalized: normalized
    };
};

module.exports = { calculateProfit };
