/**
 * Helper Utilities
 */

/**
 * Format a successful API response
 * @param {any} data 
 * @param {string} message 
 * @returns {Object}
 */
exports.formatSuccess = (data, message = 'Success') => {
    return {
        success: true,
        message,
        count: Array.isArray(data) ? data.length : 1,
        data
    };
};

/**
 * Format an error API response
 * @param {string} message 
 * @returns {Object}
 */
exports.formatError = (message = 'An error occurred') => {
    return {
        success: false,
        message,
        data: null
    };
};

/**
 * Convert string rating to number (for Books)
 * @param {string} ratingClass 
 * @returns {number}
 */
exports.convertRatingToNumber = (ratingClass) => {
    const map = {
        'One': 1,
        'Two': 2,
        'Three': 3,
        'Four': 4,
        'Five': 5
    };
    // Expected class string: "star-rating Three"
    const ratingWord = ratingClass.replace('star-rating', '').trim();
    return map[ratingWord] || 0;
};
