const xss = require('xss');

function xssMiddleware(req, res, next) {
    const  sanitizedRequest = {};

    // Sanitize request body
    for (const key in req.body) {
        sanitizedRequest[key] = xss(req.body[key]);
    }

    // Sanitize query params
    for (const key in req.query) {
        sanitizedRequest[key] = xss(req.query[key]);
    }

    // Sanitize headers
    for (const key in req.headers) {
        sanitizedRequest[key] = xss(req.headers[key]);
    }

    req.body = sanitizedRequest;
    next();
};

module.exports = xssMiddleware;