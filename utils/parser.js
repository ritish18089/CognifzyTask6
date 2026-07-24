const { convertRatingToNumber } = require('./helpers');

/**
 * Parse HTML for Books (books.toscrape.com)
 * @param {Function} $ - Cheerio loaded function
 * @param {string} baseUrl - Base URL for resolving relative links
 * @returns {Array} - Parsed books
 */
exports.parseBooks = ($, baseUrl) => {
    const books = [];
    const baseUri = new URL(baseUrl).origin;

    $('article.product_pod').each((index, element) => {
        try {
            // Image URL
            let imageSrc = $(element).find('.image_container img').attr('src');
            if (imageSrc && imageSrc.startsWith('..')) {
                imageSrc = imageSrc.replace(/^(\.\.\/)+/, '/');
            }
            const image = imageSrc ? `${baseUri}${imageSrc}` : 'https://via.placeholder.com/150';

            // Title
            const title = $(element).find('h3 a').attr('title') || $(element).find('h3 a').text();

            // Price
            const priceText = $(element).find('.price_color').text();
            // Extract numeric value from string like "£51.77"
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

            // Rating
            const ratingClass = $(element).find('p.star-rating').attr('class') || '';
            const rating = convertRatingToNumber(ratingClass);

            // Availability
            const availabilityText = $(element).find('.instock.availability').text().trim();
            const availability = availabilityText.toLowerCase().includes('in stock') ? 'In Stock' : 'Out of Stock';

            // Generate UUID-like ID for frontend keys
            const id = `book-${index}-${Date.now()}`;

            books.push({
                id,
                type: 'book',
                title: title.trim(),
                price,
                rating,
                image,
                availability
            });
        } catch (e) {
            console.error('Error parsing individual book:', e.message);
        }
    });

    return books;
};

/**
 * Parse HTML for Quotes (quotes.toscrape.com)
 * @param {Function} $ - Cheerio loaded function
 * @returns {Array} - Parsed quotes
 */
exports.parseQuotes = ($) => {
    const quotes = [];

    $('.quote').each((index, element) => {
        try {
            const text = $(element).find('.text').text().replace(/["”\u201C\u201D]/g, '').trim();
            const author = $(element).find('.author').text().trim();
            
            const tags = [];
            $(element).find('.tags .tag').each((i, tagEl) => {
                tags.push($(tagEl).text().trim());
            });

            const id = `quote-${index}-${Date.now()}`;

            quotes.push({
                id,
                type: 'quote',
                title: text, // Maps to 'title' for unified frontend processing
                author,
                tags,
                price: 0, // Quotes don't have price, default to 0 for sorting
                rating: 0, // Quotes don't have rating
                availability: 'N/A'
            });
        } catch (e) {
            console.error('Error parsing individual quote:', e.message);
        }
    });

    return quotes;
};
