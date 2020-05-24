const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.get_sign_up = function (req, res, next) {
    res.render('sign-up');
};

exports.post_sign_up = function (req, res, next) {
    const { first_name, last_name, username, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('sign-up', { errors: errors.errors });
        return;
    }
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const newUser = new User({
            first_name,
            last_name,
            username,
            password: hashedPassword,
            member: false,
        });
        newUser.save().then((doc) => {
            res.redirect('/log-in');
        });
    });
};

exports.get_log_in = function (req, res, next) {
    res.render('log-in');
};
