// authRoutes.js
// Routes for user authentication (signup and login)

const express = require('express');
const router = express.Router();

// Import authController
const authController = require('../controllers/authController');

// POST /auth/signup
router.post('/signup', authController.signup);

// POST /auth/login
router.post('/login', authController.login);

// POST /auth/logout
router.post('/logout', authController.logout);

// Export the router to be used in server.js
module.exports = router;
