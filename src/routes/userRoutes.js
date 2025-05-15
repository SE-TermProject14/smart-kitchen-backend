// userRoutes.js
// Routes for user operations (e.g., get user info)

const express = require('express');
const router = express.Router();

// Import userController
const userController = require('../controllers/userController');

router.get('/:userId', userController.getUserById);

// Export the router to be used in server.js
module.exports = router;
