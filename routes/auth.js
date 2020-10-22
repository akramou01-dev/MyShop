/** AFTER WE SEND A RESPONSE (or res.redirect) THE REQ IS DEAD SO "INUTILE" TO STORE DATA IN IT  */

const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');
const User = require('../models/user');


const authController = require('../controllers/auth');


router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);


router.post('/login',
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail({ gmail_remove_dots: false, yahoo_remove_subaddress: false }),

    check('password')
    .isLength({ min: 8 })
    .withMessage('Please enter a password at least 8 characters.')
    .trim(),
    authController.postLogin);

router.post('/logout', authController.postLogout);

router.post('/signup',
    check('fullName')
    .notEmpty().withMessage('You must enter your Full Name.')
    .isLength({ min: 4 }).withMessage('Please enter a valid name.'),

    check('email') // la methode check va checker dans tout les place ou il y a "email field"
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
        // if (value === 'test1@test.com') {
        //     throw new Error('this email is forbidden');
        // }
        // return true;
        return User.findOne({
                where: { email: value }
            })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('This email exist, please enter another one.');
                }
            });
    })
    .normalizeEmail({ gmail_remove_dots: false, yahoo_remove_subaddress: false }),
    check('password')
    .isLength({ min: 8 }).withMessage('Please enter a password at least 8 characters.')
    .trim(),
    // .matches(
    //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/, ),
    // check('password')
    // .isLength({ min: 5, max: 20 }).withMessage('Please enter a password between 5 and 20 characters.')
    // .isNumeric().withMessage('The password must contains at least one number.'),

    check('confirmPassword')
    .custom((value, { req }) => {
        if (value === '') {
            throw new Error('Please confirm your password.')
        } else if (value !== req.body.password) {
            throw new Error('Passwords does not matche.')
        }
        return true;
    })
    .trim(),
    authController.postSignup);

router.post('/reset', authController.postReset);

router.post('/new-password',
    check('password')
    .isLength({ min: 8 })
    .withMessage('Please enter a password at least 8 characters.')
    .trim(),
    authController.postNewPassword);




module.exports = router;