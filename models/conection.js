const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'dhenycruz',
  password: '147258369',
  database: 'StoreManager',
});

module.exports = connection;