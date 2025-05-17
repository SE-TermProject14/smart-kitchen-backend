const db = require('../config/db');

exports.addBuy = async (req, res) => {
  const { food_id, buy_date, buy_cnt, expire_date } = req.body;
  
  // Extracted from JWT middleware
  const customer_id = req.user.customer_id;

  // Validate required fields
  if (!food_id || !buy_date || !buy_cnt) {
    return res.status(400).json({ error: 'Required fields are missing.' });
  }

  try {
    // SQL query to insert new purchase record
    const query = `
      INSERT INTO tb_buy (customer_id, food_id, buy_date, buy_cnt, expire_date)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [customer_id, food_id, buy_date, buy_cnt, expire_date || null];

    // Execute the query and retrieve the result
    const [result] = await db.query(query, values);

    // Respond with a success message and the new record ID
    res.status(201).json({ message: 'Purchase information successfully saved.', buy_id: result.insertId });

  } catch (error) {
    console.error('Error in addBuy:', error);
    res.status(500).json({ error: 'An error occurred while saving purchase information.' });
  }
};

exports.updateBuy = async (req, res) => {
  const { buy_id } = req.params;
  const { food_id, buy_date, buy_cnt, expire_date } = req.body;

  // Extracted from JWT middleware
  const customer_id = req.user.customer_id;

  // SQL query to update the purchase record
  const query = `
    UPDATE tb_buy 
    SET food_id = ?, buy_date = ?, buy_cnt = ?, expire_date = ? 
    WHERE buy_id = ? AND customer_id = ?
  `;

  try {
    // Execute the update query
    const [result] = await db.query(query, [food_id, buy_date, buy_cnt, expire_date, buy_id, customer_id]);
    
    // Check if any record was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Purchase record not found.' });
    }

    // Respond with a success message
    res.json({ message: 'Purchase record successfully updated.' });

  } catch (err) {
    console.error('Error in updateBuy:', err);
    res.status(500).json({ error: 'An error occurred while updating purchase information.' });
  }
};

// Delete Purchase Record
exports.deleteBuy = async (req, res) => {
  const { buy_id } = req.params;
  const customer_id = req.user.customer_id;

  try {
    // 해당 buy_id가 현재 사용자의 것인지 확인
    const [buyData] = await db.query(
      `SELECT customer_id FROM tb_buy WHERE buy_id = ?`,
      [buy_id]
    );

    if (buyData.length === 0) {
      return res.status(404).json({ error: 'Purchase record not found.' });
    }

    if (buyData[0].customer_id !== customer_id) {
      return res.status(403).json({ error: 'You are not authorized to delete this purchase record.' });
    }

    // 삭제 쿼리
    const query = `DELETE FROM tb_buy WHERE buy_id = ? AND customer_id = ?`;
    await db.query(query, [buy_id, customer_id]);

    res.json({ message: 'Purchase record successfully deleted.' });
  } catch (error) {
    console.error('Error in deleteBuy:', error);
    res.status(500).json({ error: 'An error occurred while deleting the purchase record.' });
  }
};
