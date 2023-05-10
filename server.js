const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const userRoute = require('./src/routes/user.route');
const captchaRoute = require('./src/routes/captcha.route');
const testRolesRoute = require('./src/routes/testRoles.route');
const authorizationRoute = require('./src/routes/authorization.route');

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

// Routes
app.use('/api/user', userRoute);
app.use('/api/captcha', captchaRoute);
app.use('/api/authorization', authorizationRoute);
app.use('/api/test-roles', testRolesRoute);

// Listen to port
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});