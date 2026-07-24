import { state } from './app.js';
import { exportToCsv, exportToJson, exportToExcel } from './export.js';
import { renderData } from './ui.js';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const filterAvailability = document.getElementById('filterAvailability');

// Stat Elements
const statTotal = document.getElementById('statTotal');
const statAvgPrice = document.getElementById('statAvgPrice');
const statHighPrice = document.getElementById('statHighPrice');
const statInStock = document.getElementById('statInStock');

let statsChartInstance = null;

/**
 * Debounce Utility
 */
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

export const attachSearchListeners = () => {
    // Debounced search to prevent UI freezing on huge datasets
    searchInput.addEventListener('input', debounce(processData, 300));
    sortSelect.addEventListener('change', processData);
    filterAvailability.addEventListener('change', processData);
    
    // Add sentiment filter listener if it exists in UI
    const sentimentFilter = document.getElementById('filterSentiment');
    if (sentimentFilter) sentimentFilter.addEventListener('change', processData);
    
    document.getElementById('exportExcelBtn').addEventListener('click', () => {
        exportToExcel(state.processedData);
    });
    
    document.getElementById('exportCsvBtn').addEventListener('click', () => {
        exportToCsv(state.processedData);
    });
};

/**
 * Process data: Filter -> Sort -> Update Stats -> Render
 */
export const processData = () => {
    const query = searchInput.value.toLowerCase();
    const sort = sortSelect.value;
    const avail = filterAvailability.value;
    const sentimentNode = document.getElementById('filterSentiment');
    const sentiment = sentimentNode ? sentimentNode.value : 'all';

    let result = [...state.rawData];

    // Filter by Availability
    if (avail !== 'all') {
        result = result.filter(item => item.availability && item.availability.toLowerCase() === avail);
    }

    // Filter by Sentiment
    if (sentiment !== 'all') {
        result = result.filter(item => item.ai && item.ai.sentiment && item.ai.sentiment.label === sentiment);
    }

    // Fuzzy/Partial Search including AI Tags
    if (query) {
        result = result.filter(item => {
            const matchTitle = item.title && item.title.toLowerCase().includes(query);
            const matchAuthor = item.author && item.author.toLowerCase().includes(query);
            const matchTags = item.ai && item.ai.tags && item.ai.tags.some(t => t.toLowerCase().includes(query));
            return matchTitle || matchAuthor || matchTags;
        });
    }

    // Sort
    result.sort((a, b) => {
        switch (sort) {
            case 'az': return (a.title || '').localeCompare(b.title || '');
            case 'za': return (b.title || '').localeCompare(a.title || '');
            case 'priceLowHigh': return (a.price || 0) - (b.price || 0);
            case 'priceHighLow': return (b.price || 0) - (a.price || 0);
            default: return 0;
        }
    });

    state.processedData = result;
    updateStats(result);
    renderData(result);
};

/**
 * Update Statistics Dashboard & Chart
 */
const updateStats = (data) => {
    statTotal.textContent = data.length;
    
    if (data.length > 0 && state.currentTarget === 'books') {
        const totalP = data.reduce((sum, item) => sum + (item.price || 0), 0);
        const maxP = Math.max(...data.map(item => item.price || 0));
        const inStock = data.filter(item => item.availability === 'In Stock').length;
        
        statAvgPrice.textContent = `£${(totalP / data.length).toFixed(2)}`;
        statHighPrice.textContent = `£${maxP.toFixed(2)}`;
        statInStock.textContent = inStock;
        
        renderChart(data);
    } else {
        statAvgPrice.textContent = 'N/A';
        statHighPrice.textContent = 'N/A';
        statInStock.textContent = 'N/A';
        document.getElementById('chartWrapper').classList.add('hidden');
    }
};

/**
 * Render Chart.js
 */
const renderChart = (data) => {
    const wrapper = document.getElementById('chartWrapper');
    wrapper.classList.remove('hidden');
    
    const ctx = document.getElementById('statsChart').getContext('2d');
    
    // Group prices into ranges
    const priceRanges = { '0-20': 0, '21-40': 0, '41-60': 0, '60+': 0 };
    data.forEach(item => {
        if (item.price <= 20) priceRanges['0-20']++;
        else if (item.price <= 40) priceRanges['21-40']++;
        else if (item.price <= 60) priceRanges['41-60']++;
        else priceRanges['60+']++;
    });

    if (statsChartInstance) {
        statsChartInstance.destroy();
    }

    statsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(priceRanges),
            datasets: [{
                label: 'Books per Price Range (£)',
                data: Object.values(priceRanges),
                backgroundColor: 'rgba(37, 99, 235, 0.5)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Price Distribution' }
            }
        }
    });
};
