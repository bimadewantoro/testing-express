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

        next();
    } catch (error) {
        console.log(error);
    }
};

module.exports = saveUser;