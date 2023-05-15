const jwt = require('jsonwebtoken');

function verifyJWT () {
return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (token) {
                jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Invalid token',
                        });
                    } else {
                        req.decodedToken = decodedToken;
                        next();
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
}

module.exports = verifyJWT;