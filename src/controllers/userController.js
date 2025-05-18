// userController.js
const db = require('../config/db');

// Get logged-in user information
exports.getUserInfo = async (req, res) => {
  const customer_id = req.user.customer_id; // ID of the currently logged-in user

  const sql = `
    SELECT name, birthday, sex_cd, registration, modified
    FROM tb_customer
    WHERE customer_id = ?
  `;

  try {
    const [results] = await db.query(sql, [customer_id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Convert Date Format to YYYY-MM-DD
    user.birthday = new Date(user.birthday).toISOString().split('T')[0];
    user.registration = new Date(user.registration).toISOString().split('T')[0];
    user.modified = new Date(user.modified).toISOString().split('T')[0];

    res.json(user);
  } catch (err) {
    console.error('Get User DB Error:', err);
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};
