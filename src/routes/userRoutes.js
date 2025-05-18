// userRoutes.js
const express = require('express');
const router = express.Router();

// Import Controllers
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply the middleware to routes
router.get('/me', authMiddleware.verifyToken, userController.getUserInfo);

// Export the router to be used in server.js
module.exports = router;
