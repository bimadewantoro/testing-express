const db = require('../config/db');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/authorization/role.model');

function verifyRole(roles) {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decodedToken.id;
            const query = `SELECT r.name
                            FROM users u
                            JOIN user_role ur ON u.id = ur.user_id
                            JOIN roles r ON ur.role_id = r.id
                            WHERE u.id = \$1`;
            const result = await db.query(query, [userId]);
            const userRole = result.rows[0]?.name;

            const hasRole = roles.includes(userRole);
            if (!hasRole) {
                return res.status(403).json ({
                    message: 'You do not have permission to perform this action'
                });
            } else {
                next();
            }
        } catch (error) {
            console.log(error);
        }
    };
}

module.exports = verifyRole;