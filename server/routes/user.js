// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User

/* GET /login - render the login view */
router.get('/login', (req, res, next) => {
  // check to see  if the user is not already logged index
  if(!req.user) {
    // render the login page
    res.render('user/login', {
      title: 'Login',
      messages: req.flash('loginMessage'),
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
router.get('/register', (req, res, next) =>{
  // check if the user is not already logged in
  if(!req.user) {
    // render the registration page
    res.render('user/register', {
      title: 'Register',
      messages: req.flash('registerMessage'),
      username: req.user ? req.user.username : ''
    });
  }
});

// POST /register - process the registration view
router.post('/register', (req, res, next) => {
  User.register(
    new User({
        username: req.body.username,
        //password: req.body.password,
        email: req.body.email,
        username: req.body.username
      }),
      req.body.password,
      (err) => {
        if(err) {
          console.log('Error insterting new user');
          if(err.name == 'UserExistsError') {
            req.flash('registerMessage', 'Registration Error: User Already Exists!');
          }
          return res.render('user/register', {
            title: 'Register',
            messages: req.flash('registerMessage'),
            username: req.user ? req.user.username : ''
          });
        }
        // if registration is successful
        return passport.authenticate('local')(req, res, ()=>{
          res.redirect('/');
        });
      });
});

// GET /logout - logout the user and redirect to the home page
router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/'); // redirect to homepage
});

module.exports = router;