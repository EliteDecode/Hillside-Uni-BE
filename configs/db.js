const mysql = require("mysql2");

const msg = "connection successfull";

const db = mysql.createConnection({
  host: "premium283.web-hosting.com",
  user: "eimpywxv_hustdb",
  password: ",Nc=esWslFNs",
  database: "eimpywxv_hust",
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
