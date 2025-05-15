// authRoutes.js
// Routes for user authentication (signup and login)

const express = require('express');
const router = express.Router();

// Import authController
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Export the router to be used in server.js
module.exports = router;
