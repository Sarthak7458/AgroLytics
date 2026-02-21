const express = require('express');
const router = express.Router();
const orchestrator = require('../core/orchestrator');

// POST /recommend
router.post('/recommend', async (req, res) => {
    try {
        const input = req.body; // { location, season, landSize, irrigation }
        const result = await orchestrator.getRecommendation(input);
        res.json(result);
    } catch (error) {
        console.error("Error in /recommend:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /chat
router.post('/chat', async (req, res) => {
    try {
        const { crop, context, question } = req.body;
        const result = await orchestrator.getExplanation(crop, context, question);
        res.json(result);
    } catch (error) {
        console.error("Error in /chat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
