// authController.js
// User authentication: granting user access - signup and login

const db = require('../config/db');
const bcrypt = require('bcryptjs'); // Encrypt password
const jwt = require('jsonwebtoken'); // JWT token
const authMiddleware = require('../middleware/authMiddleware');

// Signup Controller
exports.signup = async (req, res) => {
  const { name, birthday, sex_cd, password } = req.body;

  try {
    // Hash the password for security
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Use current time as registration date and modified date
    const registration = new Date();

    // SQL to insert new user into tb_customer (save into DB)
    const sql = `
      INSERT INTO tb_customer (name, birthday, sex_cd, password, registration, modified)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Execute the query with await
    const [result] = await db.query(sql, [name, birthday, sex_cd, hashedPassword, registration, registration]);

    // Respond with success message
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup DB Error:', err);
    return res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { name, password } = req.body;

  try {
    // Find user by name
    const sql = `SELECT * FROM tb_customer WHERE name = ?`;

    // Use await for query execution
    const [results] = await db.query(sql, [name]);

    if (results.length === 0) {
      // No user found
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Compare provided password with stored hashed password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Create JWT token with user ID
    const token = jwt.sign(
      { customer_id: user.customer_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token valid for 1h
    );

    // Send token to client
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login DB Error:', err);
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Logout Controller
exports.logout = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Token is required.' });
  }

  try {
    // JWT Verification (Verify that it is a valid token)
    jwt.verify(token, process.env.JWT_SECRET);

    // Add tokens to blacklist
    authMiddleware.invalidateToken(token);
    console.log('Token invalidated:', token);

    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout Error:', err);
    res.status(401).json({ message: 'Invalid token.' });
  }
};