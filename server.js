const express = require('express');
const sequelize = require('sequelize');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Setting up app-port
const PORT = process.env.PORT || 3001;

// assign app to express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Listen to port
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});