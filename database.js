const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const host = process.env.SqlHost;
const user = process.env.SqlUser;
const password = process.env.SqlPassword;
const dataBase = process.env.SqlDataBase;

const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: dataBase,
  port: 3306,
});
// connection.connect(function (err) {
//   if (!err) {
//     console.log("Database is connected successfully !");
//   } else {
//     console.log("TO TEN BŁĄD<<<", err);
//     return;
//   }
// });
module.exports = connection;
