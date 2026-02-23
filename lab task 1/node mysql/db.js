const mysql = require('mysql2');

// Create a connection pool and export the promise-based pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodecrud',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();

// Note: Ensure the MySQL server is running and the `nodecrud` database exists.