/*
 *     Purpose: Auth routers for the website
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// Modules required for routing
let express = require('express');
let router = express.Router();

let userController = require('../controllers/user');

/* GET /login - render the login view */
router.get('/login', (req, res, next) => {
    userController.DisplayLogin(req, res);
});

// POST /login - process the login page
router.post('/login', userController.ProcessLogin());

// GET /register - render the register page
router.get('/register', (req, res, next) => {
    userController.DisplayRegister(req, res);
});

// POST /register - process the registration view
router.post('/register', (req, res, next) => {
    userController.ProcessRegister(req, res);
});

/* GET /reset - render the reset password view */
router.get('/reset', (req, res, next) => {
    userController.DisplayReset(req, res);
});

// POST /reset - update user's password
router.post('/reset', (req, res, next) => {
    userController.ProcessReset(req, res);
});

// GET /logout - logout the user and redirect to the home page
router.get('/logout', (req, res, next) => {
    userController.ProcessLogout(req, res);
});

module.exports = router;