const express = require('express');
const siteController = require('./controllers/siteController');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Import the scheduling code from schedule.js
const schedule = require('./services/schedule');

// Configure body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./config/db');

const port = process.env.PORT || 3000;

// Setting up template/view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setup static file connections
app.use(express.static(path.join(__dirname, "static_files")));

// Start siteController
siteController(app);


// Listen to port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
