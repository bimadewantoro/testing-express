const User = require('../models/user.model');
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
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const newUser = await user.createUser();
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 hours
        });
        res.status(201).json({newUser, token});
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
        const validateUser = 'SELECT * FROM users WHERE email = $1';
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
        const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 hours
        });
        res.status(200).json({user, token});
    } catch (error) {
        console.log(error);
    }
}

