const express = require('express');
const db = require('../models');

const User = db.users;

// avoid if username and email already exists
const checkDuplicate = (req, res, next) => {
    // Username
    User.findOne({
        where: {
            username: req.body.username,
        },
    }).then((user) => {
        if (user) {
            res.status(400).send({
                message: 'Username already exists',
            });
            return;
        }

        // Email
        User.findOne({
            where: {
                email: req.body.email,
            },
        }).then((user) => {
            if (user) {
                res.status(400).send({
                    message: 'Email already exists',
                });
                return;
            }
            next();
        });
    });
};

const userAuth = {
    checkDuplicate,
};

module.exports = userAuth;