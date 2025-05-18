// userController.js
// User-related actions (e.g., get user information)

const db = require('../config/db');  // Import MySQL connection

// Get logged-in user information
exports.getUserInfo = async (req, res) => {
  const customer_id = req.user.customer_id; // 현재 로그인된 사용자의 ID

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

    // 날짜 형식을 YYYY-MM-DD로 변환
    user.birthday = new Date(user.birthday).toISOString().split('T')[0];
    user.registration = new Date(user.registration).toISOString().split('T')[0];
    user.modified = new Date(user.modified).toISOString().split('T')[0];

    res.json(user);
  } catch (err) {
    console.error('Get User DB Error:', err);
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};
