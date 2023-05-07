const express = require('express');
const userController = require('../controllers/user.controller');
const { register, login } = userController;
const userAuth = require('../middlewares/user.auth');

const router = express.Router();

// Register
router.post('/register', userAuth, register);

// Login
router.post('/login', login);

module.exports = router;