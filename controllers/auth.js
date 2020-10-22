const bcrypt = require('bcryptjs');
const Sequelize = require("sequelize");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

/**initializing nodemailer for sending emails*/

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: `${process.env.NODEMAILER_API_KEY}`
    }
}));


exports.getLogin = (req, res, next) => {
    // extract a cookie
    // const isLoggedIn = req.get('Cookie').split(';')[0].split('=')[1];
    // console.log(req.get('Cookie'));

    /**extracting the message from the array */
    let errMessage = req.flash('error');
    if (errMessage.length > 0) {
        errMessage = errMessage[0];
    } else {
        errMessage = null;
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: errMessage, // ca retourne la valeur qu'on a stocker dans la clé 'error'
        oldInput: {
            email: "",
            password: ""
        },
        validationErrors: []

    });
};

exports.getSignup = (req, res, next) => {
    /**extracting the message from the array */
    let errMessage = req.flash('error');
    if (errMessage.length > 0) {
        errMessage = errMessage[0];
    } else {
        errMessage = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errMessage,
        oldInput: {
            fullName: "",
            email: "",
            password: "",
        },
        validationErrors: [],
        message: "",
    });
};

exports.getReset = (req, res, next) => {
    /**extracting the message from the array */
    let errMessage = req.flash('error');
    if (errMessage.length > 0) {
        errMessage = errMessage[0];
    } else {
        errMessage = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: errMessage
    })
};


exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    const date = new Date();
    const currentDate = `${date.getFullYear()}-0${date.getMonth()}-0${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.000Z`;
    User.findOne({
            where: {
                resetToken: token
            }
        })
        .then(user => {
            /**extracting the message from the array */
            let errMessage = req.flash('error');
            if (errMessage.length > 0) {
                errMessage = errMessage[0];
            } else {
                errMessage = null;
            }
            res.render('auth/new-password', {
                pageTitle: 'Reset Password',
                path: '/new-password',
                errorMessage: errMessage, // ca retourne la valeur qu'on a stocker dans la clé 'error'
                userId: user.id,
                passwordToken: token,
                errorMessage: ''
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}



exports.postLogin = (req, res, next) => {
    /** extracting user info  */
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array(),
        });
    }

    /** search for the user if he existe */
    User.findOne({
            where: { email: email }
        })
        .then(user => {
            if (!user) { //the user does not existe
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    errorMessage: 'Invalid email',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErrors: [{ param: 'email' }, { param: 'password' }]
                });
            }
            // the user existe
            bcrypt.compare(password, user.password) // la methode compare nous donnele resultat dans le resolve donc le resultat c un boolean 
                .then(doMatch => {
                    if (doMatch) { // correcte password
                        /** creating a session */
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => { /** that's to be suur that the session was created */
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    // incorrecte password
                    return res.status(422).render('auth/login', {
                        pageTitle: 'Login',
                        path: '/login',
                        errorMessage: 'Invalid password',
                        oldInput: {
                            email: email,
                            password: ''
                        },
                        validationErrors: [{ param: 'password' }]
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    });
};

exports.postSignup = (req, res, next) => {
    /**exttracting user info */
    user.createCart
    const fullName = req.body.fullName;
    const email = req.body.email;
    console.log('mzoifhzfmozhfmzofzfihzmfoizhfmzoifhzmofhifzef', email);
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req); // les errs seront stocker dans le req by the express-validator
    if (!errors.isEmpty()) {
        console.log(errors.array());
        console.log(email);
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                fullName: fullName,
                email: email,
                password: password,
            },
            validationErrors: errors.array(),
            message: "",
        });
    }
    // User.findOne({
    //         where: { email: email }
    //     })
    //     .then(userDoc => {
    //         if (userDoc) {
    //             /**the user existe */
    //             req.flash('error', 'The E-mail already existe, please enter another one.');
    //             return res.redirect('/signup');
    //         }
    // ce check for the existance of the user in the rotues folder (async validation)
    bcrypt
        .hash(password, 12)
        .then(hashedPasssword => {
            /** the user does not existe */
            const user = new User({
                fullName: fullName,
                email: email,
                password: hashedPasssword,
            });
            return user.save();
        })
        .then(user => {
            user.createCart()
                .then(result => {
                    res.redirect('/login');
                    /**sending an email after the signup */
                    return transporter.sendMail({
                        to: email,
                        from: 'akram.ouardas1@gmail.com',
                        subject: 'BestShopping Signup',
                        html: `<h1>Hey ${fullName}, Your signup at Best Shopping was successful ! </h1>`
                    });
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        });
};

exports.postReset = (req, res, next) => {
    let userFullName;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset ');
        }
        const token = buffer.toString('hex');
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                // user does not existe 
                if (!user) {
                    req.flash('error', 'Invalid E-mail.');
                    // on peut handler une erreur
                    return res.redirect('/reset');
                }
                // the user existe 
                userFullName = user.fullName;
                user.resetToken = token; // pour valider le reste 
                user.resetTokenExpiration = Date.now() + 3600000; // le lien est valide pour une heure 
                return user.save();
            })
            .then(result => {
                res.redirect('/login');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'akram.ouardas1@gmail.com',
                    subject: 'Reset Password',
                    html: `<h1>Hey ${userFullName} </h1>
                           <p>Please clik on that <a href="http://localhost:300/reset/${token}">link</a> to reset your password</p>
                    `,
                })
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    })
};

exports.postNewPassword = (req, res, next) => {
    const newPasswod = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('the paswrd is not valid');
        return res.render('auth/new-password', {
            pageTitle: 'Reset Password',
            path: '/new-password',
            userId: userId,
            passwordToken: passwordToken,
            errorMessage: errors.array()[0].msg
        });
    }
    User.findOne({
            where: {
                resetToken: passwordToken,
                id: userId
            }
        })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPasswod, 12);
        })
        .then(hashedPasssword => {
            resetUser.password = hashedPasssword;
            resetUser.resetToken = null;
            resetUser.resetTokenExpiration = null;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
            const date = new Date();
            transporter.sendMail({
                to: resetUser.email,
                from: 'akram.ouardas1@gmail.com',
                subject: 'Password Reseted',
                html: `<h1>Hey ${resetUser.fullName} </h1>
                       <p>Your password was reseted successfuly the ${date.getFullYear()}-0${date.getMonth() + 1 }-0${date.getDate()} at ${date.getHours()}:${date.getMinutes()} </p>
                `,
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}