# Web Scraping Application

## Overview
Web Scraping is a modern web scraping application built using Node.js, Express.js, Axios, Cheerio, HTML, CSS, and JavaScript. The application automatically extracts publicly available information from Books to Scrape and Quotes to Scrape, then displays the collected data in a clean, responsive, and user-friendly dashboard.

## Features
- **Dynamic Web Scraping:** Extracts data in real-time using Axios and Cheerio.
- **Glassmorphism UI:** Modern, responsive, card-based interface with hover animations.
- **Advanced Controls:** Search by title/author, sort (A-Z, Price), filter by availability.
- **Data Export:** Download scraped data directly to CSV or JSON formats.
- **Dark Mode Support:** Seamless toggling between light and dark themes using CSS variables and local storage.
- **Statistics Dashboard:** Auto-calculates total items, average price, highest price, and stock levels.

## Technology Stack
### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- EJS

### Backend
- Node.js
- Express.js

### Libraries
- Axios
- Cheerio
- Express
- Dotenv
- Nodemon

### Development Tools
- Visual Studio Code
- Git
- GitHub
- npm
- Chrome Developer Tools

### Websites Scraped
- Books to Scrape
- Quotes to Scrape

## Architecture & Workflow
<img src="https://github.com/ritish18089/CognifzyTask6/blob/main/Webscraptask6.png" width="1000px" height="1000px">

## 📌 Functional Modules
### Dashboard Module
- Displays an overview of the application.
- Shows total books and quotes scraped.
- Displays recent scraping activity.
- Provides quick navigation to all modules.
- Shows basic statistics and summary cards.

### Books Scraping Module
- Fetches book data from the Books to Scrape website.
- Extracts book title, price, rating, availability, and cover image.
- Displays books in responsive cards.
- Supports searching and filtering books.
- Allows sorting by price and rating.

### Quotes Scraping Module
- Fetches quotes from the Quotes to Scrape website.
- Extracts quote text, author, and tags.
- Displays quotes in a clean card layout.
- Supports search by quote, author, or tag.
- Allows filtering and sorting of quotes.

### Search & Filter Module
- Provides real-time search functionality.
- Filters scraped data based on keywords.
- Supports category-based filtering.
- Sorts data alphabetically or by attributes.
- Resets filters to default.

### Statistics Module
- Displays total books scraped.
- Displays total quotes scraped.
- Shows scraping statistics.
- Presents summary cards for quick insights.

### Export Module
- Exports scraped data as JSON.
- Exports scraped data as CSV.
- Downloads exported files.
- Preserves structured data format.

### Theme Management Module
- Supports Light Mode.
- Supports Dark Mode.
- Saves user theme preference.
- Updates the UI dynamically.

### Error Handling Module
- Handles invalid website responses.
- Displays network error messages.
- Handles empty scraping results.
- Shows loading and retry states.
- Prevents application crashes.

### User Interface Module
- Responsive design for all devices.
- Interactive dashboard layout.
- Card-based data presentation.
- Loading indicators.
- Smooth animations and transitions.

## Screenshots
### Dashboard
<p align="center"><img src="https://github.com/ritish18089/CognifzyTask6/blob/main/1.png" height="1000px"></p>

### Books Section
<p align="center"><img src="https://github.com/ritish18089/CognifzyTask6/blob/main/2.png" height="1000px"></p>

### Quotes Section
<p align="center"><img src="https://github.com/ritish18089/CognifzyTask6/blob/main/3.png" height="1000px"></p>

### Search Function
<p align="center"><img src="https://github.com/ritish18089/CognifzyTask6/blob/main/4.png" height="1000px"></p>

### Filter Function
<p align="center"><img src="https://github.com/ritish18089/CognifzyTask6/blob/main/5.png" height="1000px"></p>

### Export Feature
<p align="center"><img src="https://github.com/ritish18089/CognifzyTask6/blob/main/6.png" height="1000px"></p>

### Statistics
<p align="center"><img src="https://github.com/ritish18089/CognifzyTask6/blob/main/7.png" height="1000px"></p>

### AI Translation in Spanish
<p align="center"><img src="https://github.com/ritish18089/CognifzyTask6/blob/main/8.png" height="1000px"></p>

### Bookmark
<p align="center"><img src="https://github.com/ritish18089/CognifzyTask6/blob/main/9.png" height="1000px"></p>

### Responsive Mobile View
<p align="center"><img src="https://github.com/ritish18089/CognifzyTask6/blob/main/10.png" height="1000px"></p>

## Learning Outcomes
- Advanced DOM traversal using Cheerio to extract nested elements.
- Robust error handling for asynchronous API calls and network timeouts.
- Managing application state cleanly in Vanilla JavaScript without heavy frameworks.
- Building elegant, highly-responsive grid layouts and dynamic UI rendering.


