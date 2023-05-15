const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Register
router.post('/register', userController.postRegister);

// Login
router.post('/login', userController.postLogin);

// Get User by ID
router.get('/:id', userController.getUserProfile);

// Logout
router.post('/logout', userController.logout);

// Change Password
router.put('/change-password/:id', userController.changePassword);

module.exports = router;