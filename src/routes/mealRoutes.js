// mealRoutes.js
const express = require('express');
const router = express.Router();

// Import Controllers
const mealController = require('../controllers/mealController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply the middleware to routes
router.post('/add', authMiddleware.verifyToken, mealController.addMeal);
router.put('/update/:meal_id', authMiddleware.verifyToken, mealController.updateMeal);
router.delete('/delete/:meal_id', authMiddleware.verifyToken, mealController.deleteMeal);
router.get('/search', authMiddleware.verifyToken, mealController.searchFood);
router.post('/add-food', authMiddleware.verifyToken, mealController.addMealFood);
router.delete('/delete-food/:meal_food_id', authMiddleware.verifyToken, mealController.deleteMealFood);
router.get('/consumed', authMiddleware.verifyToken, mealController.getConsumedFoods);
router.get('/nutrition/date', authMiddleware.verifyToken, mealController.getTotalNutritionByDate);

// Export the router to be used in server.js
module.exports = router;
