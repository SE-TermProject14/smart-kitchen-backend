// buyRoutes.js
// Routes for handling purchase-related operations (add and update purchase information)

const express = require('express');
const router = express.Router();

// Import Controllers
const buyController = require('../controllers/buyController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply the middleware to routes
router.post('/add', authMiddleware.verifyToken, buyController.addBuy);
router.put('/update/:buy_id', authMiddleware.verifyToken, buyController.updateBuy);
router.delete('/delete/:buy_id', authMiddleware.verifyToken, buyController.deleteBuy);

module.exports = router;
