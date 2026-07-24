const express = require('express');
const router = express.Router();
const scraperService = require('../services/scraperService');
const { formatSuccess, formatError } = require('../utils/helpers');
const NodeCache = require('node-cache');

// Initialize cache with 5 minute standard TTL
const myCache = new NodeCache({ stdTTL: 300 });

/**
 * @route   GET /api/scrape
 * @desc    Scrape data from target website with caching and pagination
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { target, pages = 1, limit = 100 } = req.query;
        
        if (!target) {
            return res.status(400).json(formatError('Target is required (e.g., books, quotes)'));
        }

        const cacheKey = `scrape_${target}_${pages}`;
        const cachedData = myCache.get(cacheKey);

        if (cachedData) {
            console.log(`Serving ${target} from cache`);
            return res.json(formatSuccess(cachedData, 'Data retrieved from cache'));
        }

        const data = await scraperService.scrapeTarget(target, parseInt(pages), parseInt(limit));
        
        if (!data || data.length === 0) {
            return res.status(404).json(formatError('No data found for the specified target.'));
        }

        myCache.set(cacheKey, data);
        return res.json(formatSuccess(data, 'Data scraped successfully'));
    } catch (error) {
        console.error('Scrape Route Error:', error.message);
        
        // Handle specific Axios or network errors
        if (error.code === 'ENOTFOUND') {
            return res.status(502).json(formatError('Network failure: Unable to reach target website.'));
        }
        if (error.response) {
            return res.status(error.response.status).json(formatError(`Target website returned error ${error.response.status}`));
        }

        return res.status(500).json(formatError(error.message || 'Server error during scraping'));
    }
});

module.exports = router;
