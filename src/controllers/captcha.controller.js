const CaptchaUtil = require('../utils/captcha/captcha.util');

// Define textCaptcha and expiryTime globally
let textCaptcha;
let expiryTime;

/**
 * Get captcha
 *
 * @param req
 * @param res
 */
exports.getCaptcha = async (req, res) => {
    try {
        const captcha = CaptchaUtil.getCaptcha();
        textCaptcha = captcha.text;
        expiryTime = Date.now() + 60000; // 1 minute expiry
        res.type('svg').status(200).send(captcha.data);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Post Captcha
 *
 * @param req
 * @param res
 */
exports.postCaptcha = async (req, res) => {
    try {
        const { captcha } = req.body;
        if (expiryTime && Date.now() < expiryTime) {
            if (captcha === textCaptcha) {
                res.status(200).send('Captcha is correct');
            } else {
                res.status(400).send('Captcha is incorrect');
            }
        } else {
            res.status(400).send('Captcha has expired');
        }
    } catch (error) {
        console.log(error);
    }
}