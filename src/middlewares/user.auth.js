const express = require('express');
const db = require('../models');
const Sequelize = require('sequelize');

const User = db.users;

// avoid if username and email already exists
const saveUser = async (req, res, next) => {
    //search the database to see if user exist
    try {
        const username = await User.findOne({
            where: {
                username: {
                    [Sequelize.Op.eq]: req.body.username,
                },
            },
        });
        //if username exist in the database respond with a status of 409
        if (username) {
            return res.json(409).send("username already taken");
        }

        //checking if email already exist
        const emailcheck = await User.findOne({
            where: {
                email: {
                    [Sequelize.Op.eq]: req.body.email,
                }
            }
        });

        //if email exist in the database respond with a status of 409
        if (emailcheck) {
            return res.json(409).send("Authentication failed");
        }

        //check password length 8-12, must contain a number and special character
        const password = req.body.password;
        if (password.length < 8 || password.length > 12) {
            return res.json(400).send("Password must be between 8-12 characters");
        }
        if (!password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/)) {
            return res.json(400).send("Password must contain a number and special character");
        }
        next();
    } catch (error) {
        console.log(error);
    }
};

module.exports = saveUser;