import { renderData, renderSkeleton, showToast, toggleTheme, initTheme } from './ui.js';
import { attachSearchListeners, processData } from './search.js';

// Application State
export const state = {
    rawData: [],
    processedData: [],
    isListView: false,
    currentTarget: 'books'
};

// DOM Elements
const targetSelect = document.getElementById('targetSelect');
const pagesInput = document.getElementById('pagesInput');
const fetchDataBtn = document.getElementById('fetchDataBtn');
const viewToggleBtn = document.getElementById('viewToggleBtn');
const dataContainer = document.getElementById('dataContainer');
const navBookmarks = document.getElementById('navBookmarks');
const navHome = document.getElementById('navHome');

/**
 * Initialize Application
 */
const initApp = () => {
    initTheme();
    bindEvents();
    attachSearchListeners();
    updateBookmarkCount();
};

/**
 * Bind Core Events
 */
const bindEvents = () => {
    // Fetch Data
    fetchDataBtn.addEventListener('click', handleFetchData);
    
    // View Toggle
    viewToggleBtn.addEventListener('click', () => {
        state.isListView = !state.isListView;
        const icon = viewToggleBtn.querySelector('i');
        
        if (state.isListView) {
            dataContainer.classList.add('list-view');
            icon.classList.replace('fa-th-list', 'fa-th');
        } else {
            dataContainer.classList.remove('list-view');
            icon.classList.replace('fa-th', 'fa-th-list');
        }
    });

    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Bookmarks View Toggle
    navBookmarks.addEventListener('click', (e) => {
        e.preventDefault();
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        state.rawData = bookmarks;
        state.currentTarget = 'books'; // Default for bookmarks mixed
        processData();
        showToast('Viewing Bookmarks', 'success');
    });

    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        handleFetchData();
    });
};

export const updateBookmarkCount = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    document.getElementById('bookmarkCount').textContent = bookmarks.length;
};

// Expose globally for inline onclick handlers in rendered HTML
window.toggleBookmark = (id, title, price, image, type) => {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const existing = bookmarks.findIndex(b => b.id === id);
    if (existing > -1) {
        bookmarks.splice(existing, 1);
        showToast('Removed from Bookmarks', 'success');
    } else {
        bookmarks.push({ id, title, price, image, type, availability: 'In Stock', rating: 5 });
        showToast('Added to Bookmarks', 'success');
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkCount();
};

/**
 * Handle Fetch Data Click
 */
const handleFetchData = async () => {
    const target = targetSelect.value;
    const pages = pagesInput.value || 1;
    state.currentTarget = target;
    
    renderSkeleton(); // Show loading state
    
    try {
        const response = await fetch(`/api/scrape?target=${target}&pages=${pages}&limit=1000`);
        const json = await response.json();
        
        if (!response.ok || !json.success) {
            throw new Error(json.message || 'Failed to fetch data');
        }

        state.rawData = json.data;
        showToast(`Successfully scraped ${json.count} items!`, 'success');
        
        // Process and Render
        processData();
        
    } catch (error) {
        console.error('Fetch error:', error);
        showToast(error.message, 'error');
        dataContainer.innerHTML = `
            <div class="empty-state glass text-center p-10">
                <i class="fas fa-exclamation-triangle text-6xl text-danger mb-4"></i>
                <h2 class="text-2xl font-bold mb-2">Error Occurred</h2>
                <p class="text-muted">${error.message}</p>
            </div>
        `;
    }
};

// Start App
document.addEventListener('DOMContentLoaded', initApp);
