const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT.middleware');
const verifyRole = require('../middlewares/verifyRole.middleware');

// Route that requires the "admin" role
router.get('/admin', verifyJWT(), verifyRole('admin'), (req, res) => {
    res.json({
        message: 'You are an admin',
    });
})

// Route that requires the "Super Admin" role
router.get('/super-admin', verifyJWT(), verifyRole('super-admin'), (req, res) => {
    res.json({
        message: 'You are a Super Admin',
    });
})

module.exports = router;