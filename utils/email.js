/* The above code is creating a function that will send an email to the user. */
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const { db } = require("../configs/db");

const sendMail = async function (email, subject, text, file) {
  const transporter = nodemailer.createTransport({
    host: "premium283.web-hosting.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@info.hust.edu.ng", // your cPanel email address
      pass: "RCzZmwN,E]y!", // your cPanel email password
    },
  });

  const mailOptions = {
    from: "info@info.hust.edu.ng",
    to: email,
    subject: subject,
    html: text,
  };

  if (file && file !== "") {
    mailOptions.attachments = [{ filename: file, path: file }];
  }

  await transporter.sendMail(mailOptions);
};

const sendMailMessage = async function (email, subject, text) {
  const transporter = nodemailer.createTransport({
    host: "premium283.web-hosting.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@info.hust.edu.ng", // your cPanel email address
      pass: "RCzZmwN,E]y!", // your cPanel email password
    },
  });

  await transporter.sendMail({
    from: "info@info.hust.edu.ng",
    to: "obius@hust.edu.ng",
    subject: `${subject} -  ${email}`,
    html: text,
  });
};
let currentCounter = 1; // Initial counter value

function generateCode(year, sex, callback) {
  const query = "SELECT COUNT(*) AS count FROM staff WHERE Approved = ?";

  db.query(query, [1], (error, result) => {
    if (error) {
      callback("database error");
    } else {
      let staffCount = result[0].count + 1;
      let counterStr = String(staffCount).padStart(3, "0"); // Updated to include currentCounter
      let sexInitial = sex.charAt(0).toUpperCase();
      let yearStr = String(year).split("-")[0]; // Extracting the last two digits of the year

      let codeNumber = `HUST/${yearStr}/${sexInitial}${counterStr}`; // Updated code format to include year as 'yy'

      currentCounter++;
      callback(null, codeNumber);
    }
  });
}

// Example usage
generateCode("2023-10-23", "Female", (error, code) => {
  if (error) {
    console.error(error);
  } else {
    console.log(code);
  }
});

module.exports = { sendMail, sendMailMessage, generateCode };
