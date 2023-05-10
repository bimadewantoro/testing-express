const svgCaptcha = require('svg-captcha');

class CaptchaUtil {
    static getCaptcha() {
        const captcha = svgCaptcha.create({
            size: 6,
            ignoreChars: '0o1i',
            noise: 3,
            color: true,
            background: '#fff',
        });
        return captcha;
    }
}

module.exports = CaptchaUtil;