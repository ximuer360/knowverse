const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Successfully connected to the database.');
  connection.release();
});

module.exports = pool.promise(); 