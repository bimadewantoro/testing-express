const express = require('express');
const sequelize = require('sequelize');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('./src/models');
const userRoute = require('./src/routes/user.route');

// Setting up app-port
const PORT = process.env.PORT || 3001;

// assign app to express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

// Get Hello World
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Sync database
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and re-sync db.');
});

// Routes
app.use('/api/user', userRoute);

// Listen to port
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});