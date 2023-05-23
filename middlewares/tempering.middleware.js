const crypto = require('crypto');
const responseStatus = require('../controllers/helpers/response.helper');
require('dotenv').config();

let key = process.env.TEMPERING_SECRET_KEY;
let secretKey = Buffer.from(key, 'utf8');

function verifySignature(req, res, next) {
    try {
        const { method, headers, body } = req;
        const { 'x-signature': signature } = headers;

        // Skip verification for GET requests and form-data
        if (method === 'GET' || req.is('multipart/form-data')) {
            return next();
        }

        const hmac = crypto.createHmac('sha512', secretKey);
        hmac.update(JSON.stringify(body));
        const generatedHmac = hmac.digest('hex');

        if (generatedHmac !== signature) {
            return responseStatus(res, 401, 'Invalid Signature !', null);
        }

        return next();
    } catch (error) {
        return responseStatus(res, 500, error.message, null);
    }
}

module.exports = verifySignature;