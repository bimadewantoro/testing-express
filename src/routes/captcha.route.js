const express = require('express');
const captchaController = require('../controllers/captcha.controller');

const router = express.Router();

// Get captcha
router.get('/', captchaController.getCaptcha);

// Post captcha
router.post('/', captchaController.postCaptcha);

module.exports = router;