var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Comment = require('../models/comment');
const mainController = require('../controllers/mainController');
const { check } = require('express-validator');
const passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/home');
});

router.get('/sign-up', mainController.get_sign_up);

router.post(
    '/sign-up',
    [
        check('first_name', 'First name must be at least 2 characters long')
            .isLength({ min: 2, max: 15 })
            .escape(),
        check('last_name', 'Last name must be at least 2 characters long')
            .isLength({
                min: 2,
                max: 15,
            })
            .escape(),
        check('username', 'Username must be at least 5 characters long')
            .isLength({ min: 5, max: 20 })
            .escape(),
        check('password', 'Password must be at least 6 characters long')
            .isLength({ min: 6, max: 24 })
            .escape(),
        check('confirm_password', 'Passwords must match')
            .custom((val, { req }) => val === req.body.password)
            .escape(),
    ],
    mainController.post_sign_up
);

router.get('/log-in', mainController.get_log_in);

router.post(
    '/log-in',
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/log-in',
        failureFlash: true,
    })
);

router.get('/become-member', mainController.get_member_become);

router.post(
    '/become-member',
    [
        check('password', 'Incorrect Password. Try PURPLE')
            .custom((val, { req }) => val === process.env.MEMBER_PASSWORD)
            .escape(),
    ],
    mainController.post_member_become
);

router.get('/log-out', mainController.get_log_out);

router.get('/home', mainController.get_home);

router.get('/new-message', mainController.get_new_message_form);

router.post(
    '/new-message',
    [
        check('title', 'Title must be at least 3 characters long')
            .isLength({ min: 3, max: 30 })
            .escape(),
        check('comment', 'You must send a comment').not().isEmpty().escape(),
    ],
    mainController.post_new_message
);

router.get('/become-admin', mainController.get_admin_become);

router.post(
    '/become-admin',
    [
        check('password', 'Incorrect Password')
            .custom((val, { req }) => val === process.env.ADMIN_PASSWORD)
            .escape(),
    ],
    mainController.post_admin_become
);

router.get('/home/:id/delete', mainController.get_delete_message);

module.exports = router;
