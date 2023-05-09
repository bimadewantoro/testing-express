const express = require('express');
const userController = require('../controllers/user.controller');
const userAuth = require('../middlewares/user.auth');

const router = express.Router();

// Register
router.post('/register', userController.postRegister);

// Login
router.post('/login', userController.postLogin);

module.exports = router;