const CaptchaUtil = require('../utils/captcha/captcha.util');
const responseStatus = require('./helpers/response.helper');

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
        return responseStatus(res, error.status, error.message, null, true);
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
                return responseStatus(res, 200, 'Captcha is valid', null, false);
            } else {
                return responseStatus(res, 400, 'Captcha is invalid', null, true);
            }
        } else {
            return responseStatus(res, 400, 'Captcha has expired', null, true);
        }
    } catch (error) {
        console.log(error);
        return responseStatus(res, error.status, error.message, null, true);
    }
}