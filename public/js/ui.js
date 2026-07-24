// UI Utilities
const dataContainer = document.getElementById('dataContainer');
const toastContainer = document.getElementById('toastContainer');

/**
 * Render Data Cards
 * @param {Array} data 
 */
export const renderData = (data) => {
    dataContainer.innerHTML = '';
    
    if (data.length === 0) {
        dataContainer.innerHTML = `
            <div class="empty-state glass text-center p-10">
                <i class="fas fa-search text-6xl text-muted mb-4"></i>
                <h2 class="text-2xl font-bold mb-2">No Results Found</h2>
                <p class="text-muted">Try adjusting your filters or search query.</p>
            </div>
        `;
        return;
    }

    const fragment = document.createDocumentFragment();
    
    data.forEach((item, index) => {
        const delay = (index % 10) * 0.1;
        const card = document.createElement('div');
        card.className = 'data-card glass fade-in';
        card.style.animationDelay = `${delay}s`;
        
        if (item.type === 'book') {
            card.innerHTML = renderBook(item);
        } else if (item.type === 'quote') {
            card.innerHTML = renderQuote(item);
        }
        
        fragment.appendChild(card);
    });

    dataContainer.appendChild(fragment);
};

const renderBook = (book) => {
    const ai = book.ai || {};
    const tags = (ai.tags || []).map(t => `<span class="badge badge-primary" style="font-size:0.7rem;">${t}</span>`).join(' ');
    
    return `
        ${book.image ? `<img src="${book.image}" alt="${book.title}" class="card-img" onerror="this.src='/images/placeholder.png'">` : ''}
        <div class="card-body">
            <h3 class="card-title text-lg font-bold mb-2">${book.title}</h3>
            
            <div class="ai-insights mb-2 p-2 rounded" style="background: rgba(0,0,0,0.1);">
                <p class="text-sm font-semibold text-accent mb-1"><i class="fas fa-robot"></i> AI Summary</p>
                <p class="text-xs text-muted mb-2 translation-target" id="summary-${book.id}">${ai.summary || 'No summary available.'}</p>
                <div class="flex justify-between items-center text-xs">
                    <span title="Language: ${ai.language?.name || 'Unknown'}"><i class="fas fa-globe"></i> ${ai.language?.code || 'EN'} (${ai.language?.confidence || 0}%)</span>
                    <span title="${ai.sentiment?.label || 'Neutral'}">${ai.sentiment?.emoji || '😐'} Sentiment</span>
                </div>
            </div>
            
            <div class="mb-2">
                ${tags}
            </div>

            <div class="flex justify-between items-center mb-4">
                <span class="price font-bold text-success text-xl">£${book.price || '0.00'}</span>
                <span class="badge ${book.availability === 'In Stock' ? 'badge-success' : 'badge-danger'}">
                    ${book.availability}
                </span>
            </div>
        </div>
        <div class="card-actions flex-wrap gap-2">
            <button class="btn btn-outline flex-1" onclick="window.mockTranslate('summary-${book.id}')" title="Translate"><i class="fas fa-language"></i></button>
            <button class="btn btn-outline flex-1" onclick="window.open('${book.image}', '_blank')">View</button>
            <button class="btn btn-primary flex-1" onclick="window.toggleBookmark('${book.id}', \`${book.title.replace(/`/g, '')}\`, ${book.price}, '${book.image}', 'book')"><i class="fas fa-bookmark"></i></button>
        </div>
    `;
};

window.mockTranslate = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    // Simulate translation processing
    const originalText = el.innerText;
    el.innerHTML = `<span class="text-accent"><i class="fas fa-spinner fa-spin"></i> Translating to Spanish...</span>`;
    
    setTimeout(() => {
        el.innerText = `[Traducido] Este es un resumen simulado de inteligencia artificial para propósitos de demostración.`;
        showToast('AI Translation Completed', 'success');
        
        const trStat = document.getElementById('statTranslations');
        if (trStat) trStat.innerText = parseInt(trStat.innerText) + 1;
    }, 1500);
};

const renderQuote = (quote) => `
    <div class="card-content justify-between" style="height: 100%;">
        <div>
            <p class="quote-card">"${quote.title}"</p>
            <p class="quote-author">— ${quote.author}</p>
            <div class="quote-tags">
                ${quote.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="card-actions mt-4">
            <button class="btn btn-outline flex-1" onclick="window.copyQuote(\`${quote.title.replace(/`/g, '').replace(/'/g, "\\'")}\`, \`${quote.author.replace(/`/g, '').replace(/'/g, "\\'")}\`)">Copy</button>
        </div>
    </div>
`;

window.copyQuote = (title, author) => {
    navigator.clipboard.writeText(`${title} - ${author}`).then(() => {
        showToast('Quote copied to clipboard', 'success');
    }).catch(err => {
        showToast('Failed to copy', 'danger');
    });
};

/**
 * Render Skeletons during fetch
 */
export const renderSkeleton = () => {
    const template = document.getElementById('loaderTemplate').content.cloneNode(true);
    dataContainer.innerHTML = '';
    dataContainer.appendChild(template);
};

/**
 * Show Toast Notification
 */
export const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

/**
 * Theme Management
 */
export const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
};

export const initTheme = () => {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
};

const updateThemeIcon = (theme) => {
    const icon = document.querySelector('#themeToggle i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
};
