const User = require('../models/user.model');
const UserRole = require('../models/authorization/userRole.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * Register a new user
 *
 * @param req
 * @param res
 */
exports.postRegister = async (req, res) => {
    try {
        // Validate Username and Email not already taken
        const validateUser = 'SELECT * FROM users WHERE username = $1 OR email = $2';
        const values = [req.body.username, req.body.email];
        const { rows } = await db.query(validateUser, values);
        if (rows[0]) {
            return res.status(409).send('Username or Email already taken');
        }
        // Password must contain 8-12 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/gm;
        if (!passwordRegex.test(req.body.password)) {
            return res.status(400).send('Password must contain 8-12 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character');
        } else {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });

            const newUser = await user.createUser();
            const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
                expiresIn: 86400, // 24 hours
            });
            res.status(201).json({newUser, token});
        }
    } catch (error) {
        console.log(error);
    }
};

/**
 * Login a user
 *
 * @param req
 * @param res
 */
exports.postLogin = async (req, res) => {
    try {
        const validateUser = 'SELECT * FROM users WHERE email = \$1';
        const values = [req.body.email];
        const { rows } = await db.query(validateUser, values);
        if (!rows[0]) {
            return res.status(404).send('User not found');
        }
        const user = new User({
            username: rows[0].username,
            email: rows[0].email,
            password: rows[0].password,
        });
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).send('Invalid Password');
        }
        // // Get User Role from user_role table
        // const findUserRole = 'SELECT * FROM user_role WHERE user_id = \$1';
        // const userRoleValues = [rows[0].id];
        // const userRoleResult = await db.query(findUserRole, userRoleValues);
        // const userRole = userRoleResult.rows[0];
        // console.log('User Role:', userRole);
        //
        // // Get Role from roles table
        // const findRole = 'SELECT * FROM roles WHERE id = \$1';
        // const roleValues = [userRole.role_id];
        // const roleResult = await db.query(findRole, roleValues);
        // const role = roleResult.rows[0].name
        // console.log("Role:", role);

        const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 hours
        });
        res.status(200).json({ user, token });
    } catch (error) {
        console.log(error);
    }
}

/**
 * Logout a user
 *
 * @param req
 * @param res
 */
exports.logout = (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            console.error('No JWT token found in request headers');
            return res.status(401).send('Access Denied');
        } else {
            try {
                jwt.verify(token, process.env.JWT_SECRET);
                res.cookie('jwt', '', {
                    httpOnly: true,
                    secure: true,
                    expires: new Date(0)
                });
                console.log('User logged out successfully');
                return res.status(200).send('Logged out successfully');
            } catch (error) {
                console.error(`Error verifying JWT token: ${error.message}`);
                return res.status(401).send('Access Denied');
            }
        }
    } catch (error) {
        console.error(`Error processing logout request: ${error.message}`);
    }
}

/**
 * Get User Profile by ID with JWT
 *
 * @param req
 * @param res
 * @param id - optional parameter to allow querying for a specific user by ID
 */
exports.getUserProfile = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            console.error('No JWT token found in request headers');
            return res.status(401).send('Access Denied');
        } else {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userId = decoded.id;
                const requestedUserId = parseInt(req.params.id); // Parse the id parameter as an integer
                if (requestedUserId !== userId) { // Compare the requested user ID with the JWT user ID
                    console.error(`User with ID ${userId} attempted to access profile for user with ID ${requestedUserId}`);
                    return res.status(401).send('Access Denied');
                }
                const findUserById = 'SELECT * FROM users WHERE id = $1';
                const values = [requestedUserId];
                const { rows } = await db.query(findUserById, values);
                if (!rows[0]) {
                    console.error(`User with ID ${values[0]} not found in database`);
                    return res.status(404).send('User not found');
                } else {
                    console.log(`Returning user profile for user with ID ${values[0]}`);
                    res.status(200).json(rows[0]);
                }
            } catch (error) {
                console.error(`Error verifying JWT token: ${error.message}`);
                return res.status(401).send('Access Denied');
            }
        }
    } catch (error) {
        console.error(`Error processing getUserProfile request: ${error.message}`);
    }
}


/**
 * Change Password with save 3 previous passwords
 *
 * @param req
 * @param res
 */
exports.changePassword = async (req, res) => {
    try {
        // Get JWT token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send('Access Denied');
        }

        // Verify JWT token and get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Check if user exists in the database
        const findUserById = 'SELECT * FROM users WHERE id = $1';
        const values = [userId];
        const { rows } = await db.query(findUserById, values);
        if (!rows[0]) {
            return res.status(404).send('User not found');
        }

        // Check if old password is correct
        const { oldPassword, newPassword } = req.body;
        const isPasswordMatch = await bcrypt.compare(oldPassword, rows[0].password);
        if (!isPasswordMatch) {
            return res.status(401).send('Invalid old password');
        }

        // Check if new password is different from old passwords
        const findUserPasswords = 'SELECT password_hash FROM password_history WHERE user_id = $1 ORDER BY changed_at DESC LIMIT 3';
        const passwordValues = [userId];
        const passwordRows = await db.query(findUserPasswords, passwordValues);
        for (const row of passwordRows.rows) {
            if (newPassword && newPassword.trim() !== '') { // Add check to ensure newPassword is not empty or null
                const isMatch = await bcrypt.compare(newPassword, row.password_hash);
                if (isMatch) {
                    return res.status(400).send('New password must be different from last 3 passwords');
                }
            }
        }


        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password in the database
        const updateUserPassword = 'UPDATE users SET password = $1 WHERE id = $2';
        const userValues = [hashedPassword, userId];
        await db.query(updateUserPassword, userValues);

        // Save new password in user_passwords table
        const insertUserPassword = 'INSERT INTO password_history (user_id, password_hash) VALUES ($1, $2)';
        const insertValues = [userId, hashedPassword];
        await db.query(insertUserPassword, insertValues);

        // Return success message
        return res.status(200).send('Password changed successfully');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}