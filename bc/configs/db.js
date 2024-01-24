const mysql = require("mysql2");

const msg = "connection successfull";

const db = mysql.createConnection({
  host: process.env.dbHost,
  user: process.env.dbUser,
  password: process.env.dbPassword,
  database: process.env.dbName,
});

const connectDb = () => {
  db.connect((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log(msg.cyan.underline);
    }
  });
};

module.exports = { connectDb, db };
