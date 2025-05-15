// db.js
// MySQL database connection

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'se_termproject'
});

connection.connect((err) => {
  if (err) {
    console.error('Failed in connecting:', err);
  } else {
    console.log('Successfully connected');
  }
});

module.exports = connection;
