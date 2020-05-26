const User = require('../models/user');
const Comment = require('../models/comment');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

//GET SIGN UP FORM
exports.get_sign_up = function (req, res, next) {
    res.render('sign-up');
};

//POST SIGN UP. SAVE NEW USER TO DATABSE
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
            admin: false,
        });
        newUser.save().then((doc) => {
            res.redirect('/log-in');
        });
    });
};

//GET LOG IN FORM
exports.get_log_in = function (req, res, next) {
    res.render('log-in', { error: req.flash('error') });
};

//GET 'BECOME A MEMBER' FORM
exports.get_member_become = function (req, res, next) {
    res.render('become-member', { title: 'Become a Member' });
};

//POST ACCEPT USER REQUEST TO BECOME A MEMBER BY GIVING THE CORRECT PASSWORD
exports.post_member_become = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('become-member', { title: 'Become a member', errors: errors.errors });
        return;
    }
    const updatedUser = {
        member: true,
    };
    User.findByIdAndUpdate(req.user.id, updatedUser).then((updated) => {
        res.redirect('/home');
    });
};

//LOG OUT
exports.get_log_out = function (req, res, next) {
    req.logout('/');
    res.redirect('/log-in');
};

//GET HOME
exports.get_home = function (req, res, next) {
    Comment.find()
        .populate('user')
        .then((comments) => {
            res.render('home', { title: 'Home', comments });
        });
};

//GET NEW MESSAGE FORM
exports.get_new_message_form = function (req, res, next) {
    res.render('new-message', { title: 'Post a new message' });
};

//POST A NEW MESSAGE
exports.post_new_message = function (req, res, next) {
    const { title, comment } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('new-message', {
            title: 'Post a new message',
            header: title,
            comment,
            errors: errors.errors,
        });
        return;
    }
    const newComment = new Comment({
        title,
        timestamp: moment().format('MMMM Do YYYY [at] HH:mm:ss'),
        text: comment,
        user: req.user.id,
    });
    newComment.save().then((comment) => {
        res.redirect('/home');
    });
};

// GET BECOME AN ADMIN PAGE FORM
exports.get_admin_become = function (req, res, next) {
    res.render('become-admin', { title: 'Becom an Admin' });
};

// POST BECOME AN ADMIN PAGE DATA
exports.post_admin_become = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('become-admin', { title: 'Become an Admin', errors: errors.errors });
        return;
    }
    const updatedUser = {
        admin: true,
    };
    User.findByIdAndUpdate(req.user.id, updatedUser).then((updated) => {
        res.redirect('/home');
    });
};

//DELETE A MESSAGE
exports.get_delete_message = function (req, res, next) {
    Comment.findByIdAndDelete(req.params.id).then((deleted) => {
        res.redirect('/home');
    });
};
