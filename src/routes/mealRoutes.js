const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const authMiddleware = require('../middleware/authMiddleware');

// Add Meal
router.post('/add', authMiddleware.verifyToken, mealController.addMeal);

// Update Meal
router.put('/update/:meal_id', authMiddleware.verifyToken, mealController.updateMeal);

// Delete Meal
router.delete('/delete/:meal_id', authMiddleware.verifyToken, mealController.deleteMeal);

// Search Food
router.get('/search', authMiddleware.verifyToken, mealController.searchFood);

// Add Meal-Food Mapping
router.post('/add-food', authMiddleware.verifyToken, mealController.addMealFood);

// Delete Meal-Food Mapping
router.delete('/delete-food/:meal_food_id', authMiddleware.verifyToken, mealController.deleteMealFood);

// Get Consumed Foods (with optional date and date range)
router.get('/consumed', authMiddleware.verifyToken, mealController.getConsumedFoods);

module.exports = router;
