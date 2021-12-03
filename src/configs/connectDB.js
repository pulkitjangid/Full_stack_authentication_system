var mysql = require('mysql2');
require('dotenv').config();

var connection = mysql.createConnection({
  host: "localhost",
  database : 'authentication',
  user: 'root',
  password: '073129'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Databse Connected!");
});

module.exports = connection;