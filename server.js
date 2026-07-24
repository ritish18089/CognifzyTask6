const express = require('express');
const cors = require('cors');
const path = require('path');
const scraperRoutes = require('./routes/scraper');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/scrape', scraperRoutes);

// Render Home Page
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Task 6-Web Scraping | Advanced Dashboard',
        year: new Date().getFullYear()
    });
});

// 404 Route
app.use((req, res) => {
    res.status(404).render('index', { 
        title: '404 - Not Found',
        year: new Date().getFullYear(),
        error: 'Page not found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
