const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const verifyJWT = require('./middlewares/verifyJWT.middleware')
const verifySignature = require('./middlewares/tempering.middleware')

// Routes
const userRoute = require('./routes/user.route')
const captchaRoute = require('./routes/captcha.route')
const testRolesRoute = require('./routes/testRoles.route')
const authorizationRoute = require('./routes/authorization.route')
const testUploadRoute = require('./routes/file.route')

// Setting up app-port
const { PORT } = process.env

// Assign app to express
const app = express()

// Allow cross-origin requests
const allowedOrigins = [
  'http://localhost:3000'
]

app.use(cors({
  origin: function (origin, callback) {
    // Check if the request origin is allowed
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

// Setting up body-parser
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Setting up cookie-parser
app.use(cookieParser())

// Verify JWT
app.use(verifyJWT())

// Tempering middleware
app.use(verifySignature)

// Get Hello World
app.get('/', (req, res) => {
  res.send('Successfully connected to the server !')
})

// Routes
app.use('/api/user', userRoute)
app.use('/api/captcha', captchaRoute)
app.use('/api/authorization', authorizationRoute)
app.use('/api/test-roles', testRolesRoute)
app.use('/api/upload', testUploadRoute)

// Listen to port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
