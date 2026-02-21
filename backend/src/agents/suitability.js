const cropsData = require('../data/crops.json');

/**
 * Filters crops based on season and irrigation.
 * @param {Object} input - { season, irrigation, landSize }
 * @returns {Array} - List of suitable crop objects
 */
const filterSuitableCrops = (input) => {
    const { season, irrigation, landSize } = input;

    // Map Indian seasons to the descriptive terms used in crops.json
    const seasonMapping = {
        'kharif': 'monsoon',
        'rabi': 'winter',
        'zaid': 'summer'
    };
    // If input is Kharif/Rabi/Zaid, map it. Otherwise use as is (e.g. if we update frontend later)
    const normalizedSeason = seasonMapping[season.toLowerCase()] || season.toLowerCase();

    // Helper function for checking irrigation
    const checkIrrigation = (crop, userIrrig) => {
        if (!userIrrig) return true;
        if (userIrrig.toLowerCase() === 'irrigated') {
            return crop.irrigation.some(i => ['canal', 'tube well', 'drip', 'flooding'].includes(i.toLowerCase()));
        }
        return crop.irrigation.some(i => i.toLowerCase() === userIrrig.toLowerCase());
    };

    // 1. Strict match
    let results = cropsData.filter(crop => {
        const seasonMatch = crop.season.some(s => s.toLowerCase() === normalizedSeason);
        const irrigationMatch = checkIrrigation(crop, irrigation);
        const landMatch = Number(landSize) >= crop.minLandSize;
        return seasonMatch && irrigationMatch && landMatch;
    });

    // 2. Fallback: Ignore land size
    if (results.length === 0) {
        results = cropsData.filter(crop => {
            const seasonMatch = crop.season.some(s => s.toLowerCase() === normalizedSeason);
            const irrigationMatch = checkIrrigation(crop, irrigation);
            return seasonMatch && irrigationMatch;
        });
    }

    // 3. Fallback: Ignore irrigation and land size (match season only)
    if (results.length === 0) {
        results = cropsData.filter(crop => {
            return crop.season.some(s => s.toLowerCase() === normalizedSeason);
        });
    }

    // 4. Ultimate Fallback: Return a default versatile crop or first crop
    if (results.length === 0) {
        // Fallback to top versatile crops if even season doesn't match
        results = cropsData.filter(crop => ['Wheat', 'Rice', 'Tomato', 'Maize'].includes(crop.name));
    }

    // Safety net: if still empty somehow, return the first crop in the db
    if (results.length === 0 && cropsData.length > 0) {
        results = [cropsData[0]];
    }

    return results;
};

module.exports = { filterSuitableCrops };
