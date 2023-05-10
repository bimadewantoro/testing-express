const express = require('express');
const router = express.Router();
const verifyRole = require('../middlewares/verifyRole.middleware');

// Route that requires the "admin" role
router.get('/admin', verifyRole('admin'), (req, res) => {
    res.json({
        message: 'You are an admin',
    });
})

// Route that requires the "Super Admin" role
router.get('/super-admin', verifyRole('superadmin'), (req, res) => {
    res.json({
        message: 'You are a Super Admin',
    });
})

module.exports = router;