// buyRoutes.js
const express = require('express');
const router = express.Router();

// Import Controllers
const buyController = require('../controllers/buyController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply the middleware to routes
router.post('/add', authMiddleware.verifyToken, buyController.addBuy);
router.put('/update/:buy_id', authMiddleware.verifyToken, buyController.updateBuy);
router.delete('/delete/:buy_id', authMiddleware.verifyToken, buyController.deleteBuy);
router.get('/near-expiry', authMiddleware.verifyToken, buyController.getNearExpiryProducts);
router.get('/all', authMiddleware.verifyToken, buyController.getAllBuys);

// Export the router to be used in server.js
module.exports = router;
