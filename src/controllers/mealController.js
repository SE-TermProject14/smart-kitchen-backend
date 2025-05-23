// mealController.js
const db = require('../config/db');

// Add Meal Record
exports.addMeal = async (req, res) => {
  const { meal_date, meal_cd } = req.body;
  const customer_id = req.user.customer_id;

  if (!meal_date || !meal_cd) {
    return res.status(400).json({ error: 'Required fields are missing.' });
  }

  try {
    const query = `
      INSERT INTO tb_meal (customer_id, meal_date, meal_cd)
      VALUES (?, ?, ?)
    `;
    const values = [customer_id, meal_date, meal_cd];
    const [result] = await db.query(query, values);

    res.status(201).json({ message: 'Meal record successfully added.', meal_id: result.insertId });
  } catch (error) {
    console.error('Error in addMeal:', error);
    res.status(500).json({ error: 'An error occurred while adding the meal record.' });
  }
};

// Update Meal Record
exports.updateMeal = async (req, res) => {
  const { meal_id } = req.params;
  const { meal_date, meal_cd } = req.body;
  const customer_id = req.user.customer_id;

  if (!meal_date || !meal_cd) {
    return res.status(400).json({ error: 'Required fields are missing.' });
  }

  try {
    const query = `
      UPDATE tb_meal 
      SET meal_date = ?, meal_cd = ? 
      WHERE meal_id = ? AND customer_id = ?
    `;
    const [result] = await db.query(query, [meal_date, meal_cd, meal_id, customer_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Meal record not found.' });
    }

    res.json({ message: 'Meal record successfully updated.' });
  } catch (error) {
    console.error('Error in updateMeal:', error);
    res.status(500).json({ error: 'An error occurred while updating the meal record.' });
  }
};

// Delete Meal Record
exports.deleteMeal = async (req, res) => {
  const { meal_id } = req.params;
  const customer_id = req.user.customer_id;

  try {
    // Verify that the mean_id belongs to the current user
    const [mealData] = await db.query(
      `SELECT customer_id FROM tb_meal WHERE meal_id = ?`,
      [meal_id]
    );

    if (mealData.length === 0) {
      return res.status(404).json({ error: 'Meal not found.' });
    }

    if (mealData[0].customer_id !== customer_id) {
      return res.status(403).json({ error: 'You are not authorized to delete this meal.' });
    }

    // Delete Query
    const query = `DELETE FROM tb_meal WHERE meal_id = ? AND customer_id = ?`;
    await db.query(query, [meal_id, customer_id]);

    res.json({ message: 'Meal record successfully deleted.' });
  } catch (error) {
    console.error('Error in deleteMeal:', error);
    res.status(500).json({ error: 'An error occurred while deleting the meal record.' });
  }
};

// Search Food in tb_food
exports.searchFood = async (req, res) => {
  const { keyword } = req.query;

  try {
    const query = `
      SELECT 
        food_id, 
        food_name, 
        CONCAT(quantity, '(gORml)') AS quantity, 
        calorie, 
        carb, 
        protein, 
        fat 
      FROM tb_food
      WHERE food_name LIKE ?
      LIMIT 10
    `;
    const [rows] = await db.query(query, [`%${keyword}%`]);

    res.json(rows);
  } catch (error) {
    console.error('Error in searchFood:', error);
    res.status(500).json({ error: 'An error occurred while searching for food.' });
  }
};


// Add Meal-Food Mapping
exports.addMealFood = async (req, res) => {
  const { meal_id, food_id, quantity } = req.body;
  const customer_id = req.user.customer_id;

  if (!meal_id || !food_id || !quantity) {
    return res.status(400).json({ error: 'Required fields are missing.' });
  }

  try {
    // 1. Verify that mean_id belongs to the current user
    const [mealData] = await db.query(
      `SELECT meal_date FROM tb_meal WHERE meal_id = ? AND customer_id = ?`,
      [meal_id, customer_id]
    );

    if (mealData.length === 0) {
      return res.status(404).json({ error: 'Meal not found or unauthorized access.' });
    }

    const meal_date = mealData[0].meal_date;

    // 2. nutritional information based on food_id
    const [foodData] = await db.query(
      `SELECT calorie, carb, protein, fat FROM tb_food WHERE food_id = ?`,
      [food_id]
    );

    if (foodData.length === 0) {
      return res.status(404).json({ error: 'Food not found.' });
    }

    const { calorie, carb, protein, fat } = foodData[0];

    // Total of each nutrient ingredient
    const calorie_total = (calorie * quantity) / 100;
    const carb_total = (carb * quantity) / 100;
    const protein_total = (protein * quantity) / 100;
    const fat_total = (fat * quantity) / 100;

    // 3. Insert data into tb_meal_food
    const query = `
      INSERT INTO tb_meal_food (
        meal_id, 
        food_id, 
        customer_id, 
        quantity, 
        calorie_total, 
        carb_total, 
        protein_total, 
        fat_total
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      meal_id, 
      food_id, 
      customer_id, 
      quantity, 
      calorie_total, 
      carb_total, 
      protein_total, 
      fat_total
    ]);

    res.status(201).json({ 
      message: 'Meal-Food mapping successfully added.', 
      meal_food_id: result.insertId 
    });

  } catch (error) {
    console.error('Error in addMealFood:', error);
    res.status(500).json({ error: 'An error occurred while adding the meal-food mapping.' });
  }
};

// Delete Meal-Food Mapping
exports.deleteMealFood = async (req, res) => {
  const { meal_food_id } = req.params;
  const customer_id = req.user.customer_id;

  try {
    const [mealFoodData] = await db.query(
      `SELECT customer_id FROM tb_meal_food WHERE meal_food_id = ?`,
      [meal_food_id]
    );

    if (mealFoodData.length === 0) {
      return res.status(404).json({ error: 'Meal-Food record not found.' });
    }

    if (mealFoodData[0].customer_id !== customer_id) {
      return res.status(403).json({ error: 'You are not authorized to delete this meal-food record.' });
    }

    const query = `DELETE FROM tb_meal_food WHERE meal_food_id = ? AND customer_id = ?`;
    await db.query(query, [meal_food_id, customer_id]);

    res.json({ message: 'Meal-Food record successfully deleted.' });
  } catch (error) {
    console.error('Error in deleteMealFood:', error);
    res.status(500).json({ error: 'An error occurred while deleting the meal-food record.' });
  }
};

// Get Consumed Foods and Nutritional Info
exports.getConsumedFoods = async (req, res) => {
  const { start_date, end_date, date } = req.query;
  const customer_id = req.user.customer_id;

  let query = `
    SELECT 
      f.food_name, 
      mf.quantity, 
      DATE_FORMAT(m.meal_date, '%Y-%m-%d') AS consumed_date,
      m.meal_cd,
      mf.calorie_total, 
      mf.carb_total, 
      mf.protein_total, 
      mf.fat_total
    FROM tb_meal_food mf
    JOIN tb_meal m ON mf.meal_id = m.meal_id
    JOIN tb_food f ON mf.food_id = f.food_id
    WHERE mf.customer_id = ?
  `;

  const params = [customer_id];

  if (date) {    // Look up a specific date
    query += ` AND m.meal_date = ?`;
    params.push(date);
  } else if (start_date && end_date) {  // Look up for a specific period of time
    query += ` AND m.meal_date BETWEEN ? AND ?`;
    params.push(start_date, end_date);
  }

  query += ` ORDER BY m.meal_date DESC`;

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error in getConsumedFoods:', error);
    res.status(500).json({ error: 'An error occurred while fetching consumed foods.' });
  }
};


// Get Total Nutritional Info for a Specific Date
exports.getTotalNutritionByDate = async (req, res) => {
  const { date } = req.query;
  const customer_id = req.user.customer_id;

  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required.' });
  }

  const query = `
    SELECT 
      DATE_FORMAT(m.meal_date, '%Y-%m-%d') AS consumed_date,
      SUM(mf.calorie_total) AS total_calorie,
      SUM(mf.carb_total) AS total_carb,
      SUM(mf.protein_total) AS total_protein,
      SUM(mf.fat_total) AS total_fat
    FROM tb_meal_food mf
    JOIN tb_meal m ON mf.meal_id = m.meal_id
    WHERE mf.customer_id = ? AND m.meal_date = ?
    GROUP BY m.meal_date
  `;

  try {
    const [rows] = await db.query(query, [customer_id, date]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No consumption records found for the specified date.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error in getTotalNutritionByDate:', error);
    res.status(500).json({ error: 'An error occurred while calculating total nutrition for the specified date.' });
  }
};
