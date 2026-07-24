const axios = require('axios');
const cheerio = require('cheerio');
const parsers = require('../utils/parser');
const aiService = require('./aiService');

// Target Configuration (Base URLs for pagination)
const targets = {
    books: {
        baseUrl: 'http://books.toscrape.com/catalogue/category/books_1/page-',
        parser: parsers.parseBooks
    },
    quotes: {
        baseUrl: 'http://quotes.toscrape.com/page/',
        parser: parsers.parseQuotes
    }
};

/**
 * Scrape a specific target across multiple pages
 * @param {string} targetName - 'books' or 'quotes'
 * @param {number} pages - Number of pages to scrape concurrently
 * @param {number} limit - Max items to return total
 * @returns {Array} - Array of scraped objects
 */
exports.scrapeTarget = async (targetName, pages = 1, limit = 100) => {
    const target = targets[targetName.toLowerCase()];
    
    if (!target) {
        throw new Error(`Invalid target: ${targetName}. Valid targets are: ${Object.keys(targets).join(', ')}`);
    }

    try {
        const pagePromises = [];
        for (let i = 1; i <= pages; i++) {
            const url = targetName === 'books' ? `${target.baseUrl}${i}.html` : `${target.baseUrl}${i}/`;
            pagePromises.push(
                axios.get(url, {
                    timeout: 10000,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
                }).catch(e => {
                    console.warn(`Failed to fetch page ${i}: ${e.message}`);
                    return null; // Ignore 404s gracefully for missing pages
                })
            );
        }

        const responses = await Promise.all(pagePromises);
        let allData = [];

        responses.forEach((response, index) => {
            if (response && response.data) {
                const $ = cheerio.load(response.data);
                const pageData = target.parser($, response.config.url);
                allData = allData.concat(pageData);
            }
        });

        // Unique deduplication based on ID or Title
        const uniqueData = Array.from(new Map(allData.map(item => [item.title, item])).values());
        
        // Pass through AI Processing Pipeline
        const aiProcessedData = uniqueData.map(item => aiService.processItem(item, targetName));
        
        return aiProcessedData.slice(0, limit);

    } catch (error) {
        throw error;
    }
};
