const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // JWT 인증 미들웨어
const userController = require('../controllers/userController');

// Get logged-in user information
router.get('/me', authMiddleware.verifyToken, userController.getUserInfo);

module.exports = router;
