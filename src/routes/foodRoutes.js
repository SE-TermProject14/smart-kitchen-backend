const express = require('express');
const router = express.Router();
const { getFoods } = require('../controllers/foodController');

// GET /api/foods
router.get('/', getFoods);

module.exports = router;
