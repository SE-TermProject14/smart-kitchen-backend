// buyController.js
const db = require('../config/db');

// Add Purchase Record
exports.addBuy = async (req, res) => {
  const { buy_name, buy_date, buy_cnt, expire_date } = req.body;
  
  // Extracted from JWT middleware
  const customer_id = req.user.customer_id;

  // Validate required fields
  if (!buy_name || !buy_date || !buy_cnt) {
    return res.status(400).json({ error: 'Required fields are missing.' });
  }

  try {
    // SQL query to insert new purchase record
    const query = `
      INSERT INTO tb_buy (customer_id, buy_name, buy_date, buy_cnt, expire_date)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [customer_id, buy_name, buy_date, buy_cnt, expire_date || null];

    // Execute the query and retrieve the result
    const [result] = await db.query(query, values);

    res.status(201).json({ message: 'Purchase information successfully saved.', buy_id: result.insertId });

  } catch (error) {
    console.error('Error in addBuy:', error);
    res.status(500).json({ error: 'An error occurred while saving purchase information.' });
  }
};

// Update Purchase Record
exports.updateBuy = async (req, res) => {
  const { buy_id } = req.params;
  const { buy_name, buy_date, buy_cnt, expire_date } = req.body;

  const customer_id = req.user.customer_id;

  if (!buy_name || !buy_date || !buy_cnt) {
    return res.status(400).json({ error: 'Required fields are missing.' });
  }

  const query = `
    UPDATE tb_buy 
    SET buy_name = ?, buy_date = ?, buy_cnt = ?, expire_date = ? 
    WHERE buy_id = ? AND customer_id = ?
  `;

  try {
    const [result] = await db.query(query, [buy_name, buy_date, buy_cnt, expire_date, buy_id, customer_id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Purchase record not found.' });
    }

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

    const query = `DELETE FROM tb_buy WHERE buy_id = ? AND customer_id = ?`;
    await db.query(query, [buy_id, customer_id]);

    res.json({ message: 'Purchase record successfully deleted.' });

  } catch (error) {
    console.error('Error in deleteBuy:', error);
    res.status(500).json({ error: 'An error occurred while deleting the purchase record.' });
  }
};

// Get All Purchase Records for the Logged-In User
exports.getAllBuys = async (req, res) => {
  const customer_id = req.user.customer_id;

  const query = `
    SELECT 
      b.buy_id,
      b.buy_name,
      DATE_FORMAT(b.buy_date, '%Y-%m-%d') AS buy_date,
      b.buy_cnt,
      DATE_FORMAT(b.expire_date, '%Y-%m-%d') AS expire_date,
      DATEDIFF(b.expire_date, CURDATE()) AS days_until_expiry
    FROM tb_buy b
    WHERE b.customer_id = ?
    ORDER BY b.buy_date DESC
  `;

  try {
    const [rows] = await db.query(query, [customer_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No purchase records found.' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error in getAllBuys:', error);
    res.status(500).json({ error: 'An error occurred while retrieving purchase records.' });
  }
};


// Get Near Expiry Products (within 3 days)
exports.getNearExpiryProducts = async (req, res) => {
  const customer_id = req.user.customer_id;

  const query = `
    SELECT 
      b.buy_id,
      b.buy_name,
      DATE_FORMAT(b.buy_date, '%Y-%m-%d') AS buy_date,
      b.buy_cnt,
      DATE_FORMAT(b.expire_date, '%Y-%m-%d') AS expire_date,
      DATEDIFF(b.expire_date, CURDATE()) AS days_until_expiry
    FROM tb_buy b
    WHERE 
      b.customer_id = ? AND 
      b.expire_date IS NOT NULL AND 
      DATEDIFF(b.expire_date, CURDATE()) BETWEEN 0 AND 3
    ORDER BY b.expire_date ASC
  `;

  try {
    const [rows] = await db.query(query, [customer_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No products are expiring within 3 days.' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error in getNearExpiryProducts:', error);
    res.status(500).json({ error: 'An error occurred while retrieving near expiry products.' });
  }
};
