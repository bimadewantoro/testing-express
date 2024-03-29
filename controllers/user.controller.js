const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const db = require('../config/db')
const send = require('../utils/mail/welcome/welcomeMail.util')
const generatePassword = require('./helpers/generatePassword.helper')
const responseStatus = require('./helpers/response.helper')
const validatePassword = require('./helpers/validationPassword.helper')

/**
 * Register a new user
 *
 * @param req
 * @param res
 */
exports.postRegister = async (req, res) => {
  try {
    // Validate Username and Email not already taken
    const validateUser = 'SELECT * FROM users WHERE username = $1 OR email = $2'
    const values = [req.body.username, req.body.email]
    const { rows } = await db.query(validateUser, values)
    if (rows[0]) {
      return responseStatus(res, 400, 'Username or Email already taken', null, true)
    }

    // Validate format email
    const validateEmail = /\S+@\S+\.\S+/
    if (!validateEmail.test(req.body.email)) {
      return responseStatus(res, 400, 'Invalid email format', null, true)
    }

    // Validate Username
    const validateUsername = /^[a-zA-Z0-9]+$/
    if (!validateUsername.test(req.body.username)) {
      return responseStatus(res, 400, 'Invalid username format', null, true)
    }

    const password = generatePassword()
    const salt = await bcrypt.genSalt(11)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      mobileNumber: req.body.mobileNumber
    })
    const newUser = await user.createUser()

    // Generate JWT Token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: 86400 // 24 hours
    })

    // Send Welcome Email
    await send.sendMailRegister(newUser, password)

    // Saved Password in History
    const passwordHistory = 'INSERT INTO password_history (user_id, password_hash, expires_at) VALUES ($1, $2, $3)'
    const valuesPassword = [newUser.id, hashedPassword, new Date(Date.now() + 86400000)] // Password expires in 24 hours
    await db.query(passwordHistory, valuesPassword)

    const data = {
      user: newUser,
      token
    }

    // Response Status
    responseStatus(res, 201, 'User created successfully', data, false)
  } catch (error) {
    console.log(error)
    responseStatus(res, error.status, error.message, null, true)
  }
}

/**
 * Login a user
 *
 * @param req
 * @param res
 */
exports.postLogin = async (req, res) => {
  try {
    const validateUser = 'SELECT * FROM users WHERE email = $1'
    const values = [req.body.email]
    const { rows } = await db.query(validateUser, values)
    if (!rows[0]) {
      return responseStatus(res, 404, 'User not found', null, true)
    }
    const user = new User({
      username: rows[0].username,
      email: rows[0].email,
      password: rows[0].password
    })

    // Verify password not expired
    const expiredPassword = 'SELECT * FROM password_history WHERE user_id = $1 ORDER BY changed_at DESC LIMIT 1'
    const valuesExpired = [rows[0].id]
    const { rows: expiresAt } = await db.query(expiredPassword, valuesExpired)
    if (expiresAt[0]) {
      const now = new Date()
      const expires = new Date(expiresAt[0].expires_at)
      if (now > expires) {
        return responseStatus(res, 401, 'Password expired, please change your password !', null, true)
      }
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return responseStatus(res, 401, 'Invalid password', null, true)
    }

    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: 86400 // 24 hours
    })

    const data = {
      user: rows[0],
      token
    }

    responseStatus(res, 200, 'User logged in successfully', data, false)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Logout a user
 *
 * @param req
 * @param res
 */
exports.logout = (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      console.error('No JWT token found in request headers')
      return responseStatus(res, 401, 'Access Denied', null, true)
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET)
      res.cookie('jwt', '', {
        httpOnly: true,
        secure: true,
        expires: new Date(0)
      })
      console.log('User logged out successfully')
      return responseStatus(res, 200, 'User logged out successfully', null, false)
    } catch (error) {
      console.error(`Error verifying JWT token: ${error.message}`)
      return responseStatus(res, 401, 'Access Denied', null, true)
    }
  } catch (error) {
    console.log(error)
    return responseStatus(res, error.status, error.message, null, true)
  }
}

/**
 * Get User Profile by ID with JWT
 *
 * @param req
 * @param res
 * @param id - optional parameter to allow querying for a specific user by ID
 */
exports.getUserProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      console.error('No JWT token found in request headers')
      return responseStatus(res, 401, 'Access Denied', null, true)
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const userId = decoded.id
      const requestedUserId = parseInt(req.params.id) // Parse the id parameter as an integer
      if (requestedUserId !== userId) { // Compare the requested user ID with the JWT user ID
        console.error(`User with ID ${userId} attempted to access profile for user with ID ${requestedUserId}`)
        return responseStatus(res, 401, 'Access Denied', null, true)
      }
      const findUserById = 'SELECT * FROM users WHERE id = $1'
      const values = [requestedUserId]
      const { rows } = await db.query(findUserById, values)
      if (!rows[0]) {
        console.error(`User with ID ${values[0]} not found in database`)
        return responseStatus(res, 404, 'User not found', null, true)
      }
      console.log(`Returning user profile for user with ID ${values[0]}`)
      return responseStatus(res, 200, 'User profile retrieved successfully', rows[0], false)
    } catch (error) {
      console.error(`Error verifying JWT token: ${error.message}`)
      return responseStatus(res, 401, 'Access Denied', null, true)
    }
  } catch (error) {
    console.log(error)
    return responseStatus(res, error.status, error.message, null, true)
  }
}

/**
 * Change Password and save 3 previous passwords
 *
 * @param req
 * @param res
 */
exports.changePassword = async (req, res) => {
  try {
    // Get JWT token from Authorization header
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      return responseStatus(res, 401, 'Access Denied', null, true)
    }

    // Verify JWT token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    // Check if user exists in the database
    const findUserById = 'SELECT * FROM users WHERE id = $1'
    const values = [userId]
    const { rows } = await db.query(findUserById, values)
    if (!rows[0]) {
      return responseStatus(res, 404, 'User not found', null, true)
    }

    // Check if old password is correct
    const { oldPassword, newPassword } = req.body
    const isPasswordMatch = await bcrypt.compare(oldPassword, rows[0].password)
    if (!isPasswordMatch) {
      return responseStatus(res, 401, 'Invalid password', null, true)
    }

    // Validate Password
    if (!validatePassword(newPassword)) {
      return responseStatus(res, 400, 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character', null, true)
    }

    // Check if new password is different from 3 old passwords
    const findUserPasswords = 'SELECT password_hash FROM password_history WHERE user_id = $1 ORDER BY changed_at DESC LIMIT 3'
    const passwordValues = [userId]
    const passwordRows = await db.query(findUserPasswords, passwordValues)
    for (const row of passwordRows.rows) {
      if (newPassword && newPassword.trim() !== '') { // Add check to ensure newPassword is not empty or null
        const isMatch = await bcrypt.compare(newPassword, row.password_hash)
        if (isMatch) {
          return responseStatus(res, 400, 'New password must be different from last 3 previous passwords', null, true)
        }
      }
    }

    // Hash new password
    const salt = await bcrypt.genSalt(11)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update user password in the database
    const updateUserPassword = 'UPDATE users SET password = $1 WHERE id = $2'
    const userValues = [hashedPassword, userId]
    await db.query(updateUserPassword, userValues)

    // Password Expires in 90 days
    const passwordExpiresAt = new Date()
    passwordExpiresAt.setDate(passwordExpiresAt.getDate() + 90)

    // Save new password in user_passwords table
    const insertUserPassword = 'INSERT INTO password_history (user_id, password_hash, expires_at) VALUES ($1, $2, $3)'
    const insertValues = [userId, hashedPassword, passwordExpiresAt]
    await db.query(insertUserPassword, insertValues)

    return responseStatus(res, 200, 'Password changed successfully', null, false)
  } catch (error) {
    console.log(error)
    return responseStatus(res, 500, error.message, null, true)
  }
}
