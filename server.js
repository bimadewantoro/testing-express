const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const userRoute = require('./routes/user.route');
const captchaRoute = require('./routes/captcha.route');
const testRolesRoute = require('./routes/testRoles.route');
const authorizationRoute = require('./routes/authorization.route');
const testUploadRoute = require('./routes/file.route');

// Setting up app-port
const PORT = process.env.PORT || 3001;

// assign app to express
const app = express();

// Setting up body-parser
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Setting up cookie-parser
app.use(cookieParser());

// Get Hello World
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Routes
app.use('/api/user', userRoute);
app.use('/api/captcha', captchaRoute);
app.use('/api/authorization', authorizationRoute);
app.use('/api/test-roles', testRolesRoute);
app.use('/api/upload', testUploadRoute);

// Listen to port
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});