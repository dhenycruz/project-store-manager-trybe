require('dotenv').config();
const mysql = require('mysql2/promise');

const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST } = process.env;
const connection = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
});

module.exports = connection;