const crypto = require('crypto');
require('dotenv').config();

const responseStatus = require('../controllers/helpers/response.helper');
const secretKey = process.env.TEMPERING_SECRET_KEY;

function verifySignature(req, res, next) {
    if (req.method === 'GET') {
        // Skip verification for GET requests
        return next();
    }

    const receivedHMAC = req.headers['X-signature'];

    if (!receivedHMAC) {
        responseStatus(res, 401, 'No Signature Received !', null);
        return;
    }

    const hmac = crypto.createHmac('sha512', secretKey);
    hmac.update(JSON.stringify(req.body));

    const calculatedHMAC = hmac.digest('hex');

    if (receivedHMAC !== calculatedHMAC) {
        responseStatus(res, 401, 'Invalid Signature !', null);
        return;
    }

    next();
}

module.exports = verifySignature;