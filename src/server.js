// server.js
// Main entry point of the Smart Kitchen backend

require('dotenv').config({ path: '../.env' });         // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());                    // Enable CORS for cross-origin requests
app.use(morgan('dev'));             // Log HTTP requests to console
app.use(express.json());            // Parse JSON request bodies


// Route imports
const buyRoutes = require('./routes/buyRoutes');   
const authRoutes = require('./routes/authRoutes');    
const userRoutes = require('./routes/userRoutes'); 
const mealRoutes = require('./routes/mealRoutes');    

// Route mounting
app.use('/auth', authRoutes);             // e.g. /auth/signup, /auth/login, /auth/logout
app.use('/api/users', userRoutes);            // e.g. /users/:userId
app.use('/api/buy', buyRoutes);           // e.g. /api/buy/add, /api/buy/update/:buy_id, /api/buy/delete/:buy_id
                                          //      /api/buy/all, /api/buy/near-expiry
app.use('/api/meals', mealRoutes);        // e.g. /api/meals/add, /api/meals/update/:meal_id
                                          //      /api/meals/delete/:meal_id
                                          //      /api/meals/search?keyword=김밥
                                          //      /api/meals/add-food, /api/meals/delete-food/:meal_food_id
                                          //      /api/meals/consumed
                                          //      /api/meals/consumed?date=2025-05-20
                                          //      /api/meals/consumed?start_date=2025-05-08&end_date=2025-05-20
                                          //      /api/meals/nutrition/date?date=2025-05-30

// Test route
app.get('/', (req, res) => {
  res.send('Smart Kitchen Backend API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
