// authRoutes.js
const express = require('express');
const router = express.Router();

// Import authController
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Export the router to be used in server.js
module.exports = router;
