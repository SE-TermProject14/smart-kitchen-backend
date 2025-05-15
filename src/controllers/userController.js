// userController.js
// User-related actions (e.g., get user information)

const db = require('../config/db');  // Import MySQL connection

// Get user information by user ID

exports.getUserById = (req, res) => {
  // Extract userId from the URL path parameter
  const userId = req.params.userId;

  // SQL query to fetch user info from tb_customer by customer_id
  const sql = `
    SELECT name, birthday, sex_cd, registration, modified
    FROM tb_customer
    WHERE customer_id = ?
  `;

  // Execute the SQL query
  db.query(sql, [userId], (err, results) => {
    if (err) {
      // Database error occurred
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      // No user found with the given ID
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user information as JSON (only one user)
    res.json(results[0]);
  });
};
