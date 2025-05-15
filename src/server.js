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
const foodRoutes = require('./routes/foodRoutes');     
const authRoutes = require('./routes/authRoutes');    
const userRoutes = require('./routes/userRoutes');     

// Route mounting
app.use('/api/foods', foodRoutes);        // e.g. /api/foods
app.use('/auth', authRoutes);             // e.g. /auth/signup, /auth/login
app.use('/users', userRoutes);            // e.g. /users/:userId

// Test route
app.get('/', (req, res) => {
  res.send('Smart Kitchen Backend API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
