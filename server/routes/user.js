/*
 *     Purpose: Auth routers for the website
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// Modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// Define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User

/* GET /login - render the login view */
router.get('/login', (req, res, next) => {
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
});

// POST /login - process the login page
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true
}));

// GET /register - render the register page
router.get('/register', (req, res, next) => {
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
});

// POST /register - process the registration view
router.post('/register', (req, res, next) => {
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
});

/* GET /reset - render the reset password view */
router.get('/reset', (req, res, next) => {
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
});

// POST /reset - update user's password
router.post('/reset', (req, res, next) => {
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
              req.flash('resetMessage', 'Password is updated successfuly!');
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
});

// GET /logout - logout the user and redirect to the home page
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/'); // redirect to homepage
});

module.exports = router;