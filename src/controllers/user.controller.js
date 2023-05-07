const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');

// User model
const User = db.users;

// Register
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create({
            username,
            email,
            password: bcrypt.hashSync(password, 8),
        });
        // Generate JWT Token and Set Cookie to Token
        if (user) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 86400, // 24 hours
            });

            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 86400,
            });

            console.log("user :", JSON.stringify(user, null, 2));
            console.log("token :", token);
            return res.status(201).send(user);
        } else {
            return res.status(500).send({
                message: "Error creating user",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error creating user",
        });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            where: {
                username,
            },
        });

        if (!user) {
            return res.status(404).send({
                message: "User Not found.",
            });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!",
            });
        }

        // Generate JWT Token and Set Cookie to Token
        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 hours
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 86400,
        });

        console.log("user :", JSON.stringify(user, null, 2));
        console.log("token :", token);
        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error logging in",
        });
    }
};

module.exports = {
    register,
    login,
};

