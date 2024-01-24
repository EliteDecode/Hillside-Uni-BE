/* The above code is creating a function that will send an email to the user. */
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendMail = async function (email, subject, text) {
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
    to: email,
    subject: subject,
    html: text,
  });
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

module.exports = { sendMail, sendMailMessage };
