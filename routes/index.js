var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Comment = require('../models/comment');
const mainController = require('../controllers/mainController');
const { check } = require('express-validator');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/sign-up', mainController.get_sign_up);

//this works without the validation array, but not with it
router.post(
    '/sign-up',
    [
        check('first_name', 'First name must be at least 2 characters long')
            .isLength({ min: 2, max: 15 })
            .escape(),
        check('last_name', 'Last name must be at least 2 characters long').isLength({
            min: 2,
            max: 15,
        }).escape,
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
    mainController.post_sign_up,
);

router.get('/log-in', mainController.get_log_in);

module.exports = router;
