// userController.js
// User-related actions (e.g., get user information)

const db = require('../config/db');  // Import MySQL connection

// Get user information by user ID
exports.getUserById = async (req, res) => {
  // Extract userId from the URL path parameter
  const userId = req.params.userId;

  // SQL query to fetch user info from tb_customer by customer_id
  const sql = `
    SELECT name, birthday, sex_cd, registration, modified
    FROM tb_customer
    WHERE customer_id = ?
  `;

  try {
    // Execute the SQL query asynchronously
    const [results] = await db.query(sql, [userId]);

    if (results.length === 0) {
      // No user found with the given ID
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Convert date format to the desired format (e.g., YYYY-MM-DD)
    user.birthday = new Date(user.birthday).toISOString().split('T')[0]; // YYYY-MM-DD
    user.registration = new Date(user.registration).toISOString().split('T')[0];
    user.modified = new Date(user.modified).toISOString().split('T')[0];

    // Return the user information as JSON (only one user)
    res.json(user);
    
  } catch (err) {
    console.error('Get User DB Error:', err);
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};
