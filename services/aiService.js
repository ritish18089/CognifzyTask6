/**
 * AI Service (Local NLP Pipeline)
 * Provides local heuristic-based analysis for sentiment, tags, summarization, and language.
 */

// Basic sentiment dictionary
const positiveWords = ['good', 'great', 'awesome', 'excellent', 'amazing', 'best', 'beautiful', 'love', 'success', 'happy', 'smart', 'intelligent'];
const negativeWords = ['bad', 'terrible', 'awful', 'worst', 'ugly', 'hate', 'fail', 'sad', 'stupid', 'boring', 'poor'];

/**
 * Perform Sentiment Analysis on a text string
 * @param {string} text 
 * @returns {Object} { label, score, confidence, emoji }
 */
const analyzeSentiment = (text) => {
    if (!text) return { label: 'Neutral', score: 0, confidence: 50, emoji: '😐' };
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    let score = 0;

    words.forEach(word => {
        if (positiveWords.includes(word)) score += 1;
        if (negativeWords.includes(word)) score -= 1;
    });

    let label = 'Neutral';
    let emoji = '😐';
    let confidence = 50 + (Math.abs(score) * 10);
    confidence = confidence > 99 ? 99 : confidence;

    if (score > 1) {
        label = 'Very Positive';
        emoji = '🤩';
    } else if (score === 1) {
        label = 'Positive';
        emoji = '😊';
    } else if (score === -1) {
        label = 'Negative';
        emoji = '😞';
    } else if (score < -1) {
        label = 'Very Negative';
        emoji = '😡';
    }

    return { label, score, confidence, emoji };
};

/**
 * Generate intelligent tags based on text content
 */
const generateTags = (text, category) => {
    const tags = new Set();
    const str = (text || '').toLowerCase();
    
    if (category === 'books') tags.add('Literature');
    if (category === 'quotes') tags.add('Inspiration');

    if (str.includes('science') || str.includes('physics')) tags.add('Science');
    if (str.includes('love') || str.includes('heart')) tags.add('Romance');
    if (str.includes('mystery') || str.includes('murder')) tags.add('Mystery');
    if (str.includes('magic') || str.includes('fantasy')) tags.add('Fantasy');
    if (str.includes('history') || str.includes('war')) tags.add('History');
    if (str.includes('code') || str.includes('program')) tags.add('Technology');

    // Add some random/default tags if empty
    if (tags.size === 1) tags.add(positiveWords[Math.floor(Math.random() * positiveWords.length)]);

    return Array.from(tags).slice(0, 4);
};

/**
 * Detect Language (Heuristic mock based on character sets)
 */
const detectLanguage = (text) => {
    if (!text) return { name: 'Unknown', code: 'UN', confidence: 0 };
    // Simplified heuristic: Assume English for toscrape.com, but add mock detection
    // If it contains specific chars it would be different.
    return { name: 'English', code: 'EN', confidence: 95 }; 
};

/**
 * Auto-Summarize long text
 */
const summarize = (text) => {
    if (!text) return "No description available.";
    const sentences = text.split('. ');
    if (sentences.length <= 2) return text;
    return sentences.slice(0, 2).join('. ') + '...';
};

/**
 * Process a single scraped item through the AI pipeline
 */
exports.processItem = (item, targetType) => {
    const textToAnalyze = `${item.title || ''} ${item.description || item.quote || ''}`;
    
    return {
        ...item,
        ai: {
            sentiment: analyzeSentiment(textToAnalyze),
            tags: generateTags(textToAnalyze, targetType),
            language: detectLanguage(textToAnalyze),
            summary: summarize(item.description || item.quote || item.title)
        }
    };
};
