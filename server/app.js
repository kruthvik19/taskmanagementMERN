const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); // Import CORS middleware

const app = express();

// CORS Configuration
app.use(cors({
  origin: "https://merry-zabaione-59cdd1.netlify.app", // Replace with your actual Netlify domain
  credentials: true, // Include this if your requests send cookies or need credentials
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', require('./src/v1/routes'));

module.exports = app;
