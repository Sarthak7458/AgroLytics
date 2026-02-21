const suitabilityAgent = require('../agents/suitability');
const demandAgent = require('../agents/demand');
const riskAgent = require('../agents/risk');
const profitAgent = require('../agents/profit');
const explainAgent = require('../agents/explain');

const getRecommendation = async (input) => {
    console.log("Orchestrator received:", input);

    // 1. Suitability Agent: Filter crops
    const suitableCrops = suitabilityAgent.filterSuitableCrops(input);

    if (suitableCrops.length === 0) {
        return {
            recommended: null,
            alternatives: [],
            message: "No suitable crops found for these conditions."
        };
    }

    // 2. Score crops using other agents
    const scoredCrops = await Promise.all(suitableCrops.map(async (crop) => {
        // Get Live Market Data
        const marketData = demandAgent.getMarketData(crop.id);

        // Calculate scores using live data
        const demandScore = await demandAgent.calculateDemandScore(marketData.trend); // 0-10
        const riskProfile = await riskAgent.evaluateRisk(crop.id, input.location);
        const profit = profitAgent.calculateProfit(crop.id, marketData.price); // returns { raw, normalized }

        // Weighted Scoring Formula
        // Score = (0.5 * NormalizedProfit) + (0.3 * DemandScore) - (0.2 * RiskPenalty)
        let score = (0.5 * profit.normalized) + (0.3 * demandScore) - (0.2 * riskProfile.penalty);

        // Confidence Calculation
        let confidence = 'Low';
        if (riskProfile.isLiveData) {
            confidence = 'High'; // Weather is the main live factor we have
            // If we had real market API, we'd check that too.
            // For now, consistent with plan: High if live data, else Low/Medium.
        }

        return {
            ...crop,
            demandScore,
            riskProfile,
            expectedProfit: profit.raw,
            marketPrice: marketData.price,
            marketTrend: marketData.trend,
            finalScore: score,
            confidence: confidence,
            profitScore: profit.normalized
        };
    }));

    // 3. Rank Crops
    scoredCrops.sort((a, b) => b.finalScore - a.finalScore);

    const winner = scoredCrops[0];
    const alternatives = scoredCrops.slice(1, 3);

    // 4. Explain Agent
    const winnerExplanation = explainAgent.generateExplanation(
        winner.name,
        input.season,
        [`It has ${winner.riskProfile.level} risk`, `Market trend is ${winner.marketTrend}`, `Confidence: ${winner.confidence}`]
    );

    return {
        recommended: {
            ...winner,
            explanation: winnerExplanation,
            confidence: winner.confidence
        },
        alternatives: alternatives.map(a => ({
            id: a.id,
            name: a.name,
            expectedProfit: a.expectedProfit,
            marketPrice: a.marketPrice,
            marketTrend: a.marketTrend,
            confidence: a.confidence,
            riskLevel: a.riskProfile.level
        }))
    };
};

const getExplanation = async (cropName, context, question) => {
    return {
        response: await explainAgent.generateChatResponse(cropName, context, question)
    };
};

module.exports = { getRecommendation, getExplanation };
