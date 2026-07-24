# Task 6: Web Scraping Application

A robust, interactive, full-stack web scraping dashboard built with Node.js, Express, Axios, Cheerio, and modern Vanilla JavaScript.

## Features
- **Dynamic Web Scraping:** Extracts data in real-time using Axios and Cheerio.
- **Glassmorphism UI:** Modern, responsive, card-based interface with hover animations.
- **Advanced Controls:** Search by title/author, sort (A-Z, Price), filter by availability.
- **Data Export:** Download scraped data directly to CSV or JSON formats.
- **Dark Mode Support:** Seamless toggling between light and dark themes using CSS variables and local storage.
- **Statistics Dashboard:** Auto-calculates total items, average price, highest price, and stock levels.

## Technology Stack
- **Backend:** Node.js, Express.js
- **Scraping:** Axios, Cheerio
- **Templating:** EJS (Embedded JavaScript templates)
- **Frontend:** HTML5, CSS3, ES6 JavaScript

## Folder Structure
```
Task 6-Web Scraping/
├── public/
│   ├── css/ (style.css, responsive.css)
│   ├── js/  (app.js, search.js, ui.js, export.js)
│   └── images/
├── routes/
│   └── scraper.js
├── services/
│   └── scraperService.js
├── utils/
│   ├── parser.js
│   └── helpers.js
├── views/
│   └── index.ejs
├── server.js
├── package.json
└── README.md
```

## Installation & How to Run
1. Navigate into the directory: `cd "Task 6-Web Scraping"`
2. Install dependencies: `npm install`
3. Run the application: `npm run dev` (uses nodemon) or `node server.js`
4. Open your browser and navigate to `http://localhost:3000`

## Learning Outcomes
- Advanced DOM traversal using Cheerio to extract nested elements.
- Robust error handling for asynchronous API calls and network timeouts.
- Managing application state cleanly in Vanilla JavaScript without heavy frameworks.
- Building elegant, highly-responsive grid layouts and dynamic UI rendering.

## License
ISC
