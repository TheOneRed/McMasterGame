/*
 *     Purpose: Auth controllers for the website
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// Modules required for db processing
let mongoose = require('mongoose');
let passport = require('passport');

// Define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User

//Check if authenticated
module.exports.RequireAuth = (req, res, next) => {
    if (process.env.NODE_ENV != 'test') {
        if (!req.isAuthenticated()) {
            return res.redirect('/user/login');
        }
    }
    next();
}

/* /login controller - render the login view */
module.exports.DisplayLogin = (req, res) => {
    // check to see  if the user is not already logged index
    if (!req.user) {
        // render the login page
        res.render('user/login', {
            title: 'Login',
            messages: req.flash('error'),
            username: req.user ? req.user.username : ''
        });
        return;
    } else {
        return res.redirect('/');
    }
}
// /login controller - process the login page
module.exports.ProcessLogin = (req, res) => {
    return passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })
}

// /register controller - render the register page
module.exports.DisplayRegister = (req, res) => {
    // check if the user is not already logged in
    if (!req.user) {
        // render the registration page
        res.render('user/register', {
            title: 'Register',
            messages: req.flash('registerMessage'),
            username: req.user ? req.user.username : ''
        });
        return;
    } else {
        return res.redirect('/');
    }
}

// /register controller - process the registration view
module.exports.ProcessRegister = (req, res) => {
    User.setPassword()
    User.register(
        new User({
            username: req.body.username,
            email: req.body.email,
        }),
        req.body.password,
        (err) => {
            if (err) {
                console.log('Error insterting new user');
                if (err.name == 'UserExistsError') {
                    req.flash('registerMessage', 'Registration Error: User Already Exists!');
                }
                return res.render('user/register', {
                    title: 'Register',
                    messages: req.flash('registerMessage'),
                    username: req.user ? req.user.username : ''
                });
            }
            // if registration is successful
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/');
            });
        });
}

/* /reset controller - render the reset password view */
module.exports.DisplayReset = (req, res) => {
    // Check if user authorized for this function
    if (req.user) {
        // render the login page
        res.render('user/reset', {
            title: 'Reset',
            messages: req.flash('error'),
            username: req.user ? req.user.username : ''
        });
        return;
    } else {
        return res.redirect('/');
    }
}

//  /reset controller - update user's password
module.exports.ProcessReset = (req, res) => {
    // Check if user authorized for this function
    if (req.user) {
        // Check if password matches
        if (req.body.password == req.body.confPassword) {
            User.findByUsername(req.body.username).then(function (sanitizedUser) {
                // Check if user found
                if (sanitizedUser) {
                    // Check if email matches
                    if (sanitizedUser.email === req.body.email) {
                        sanitizedUser.setPassword(req.body.password, function () {
                            sanitizedUser.save();
                            req.flash('resetMessage', 'Password is updated successfully!');
                            return res.render('user/reset', {
                                title: 'Reset',
                                messages: req.flash('resetMessage'),
                                username: req.user ? req.user.username : ''
                            });
                        });
                    } else {
                        req.flash('resetMessage', 'Email doesn\'t match, please try again!');
                        return res.render('user/reset', {
                            title: 'Reset',
                            messages: req.flash('resetMessage'),
                            username: req.user ? req.user.username : ''
                        });
                    }
                } else {
                    req.flash('registerMessage', 'Username is not found, please try again!');
                    return res.render('user/reset', {
                        title: 'Reset',
                        messages: req.flash('registerMessage'),
                        username: req.user ? req.user.username : ''
                    });
                }
            }, function (err) {
                req.flash('registerMessage', 'Username is not found, please try again!');
                return res.render('user/reset', {
                    title: 'Reset',
                    messages: req.flash('registerMessage'),
                    username: req.user ? req.user.username : ''
                });
            })
        } else {
            req.flash('resetMessage', 'Passwords don\'t match!');
            return res.render('user/reset', {
                title: 'Reset',
                messages: req.flash('resetMessage'),
                username: req.user ? req.user.username : ''
            });
        }
    } else {
        return res.redirect('/');
    }
}

// /logout controller - logout the user and redirect to the home page
module.exports.ProcessLogout = (req, res) => {
    req.logout();
    res.redirect('/'); // redirect to homepage
}