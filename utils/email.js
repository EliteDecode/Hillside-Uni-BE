/* The above code is creating a function that will send an email to the user. */
const nodemailer = require("nodemailer");

const sendMail = async function (email, subject, text) {
  const transporter = nodemailer.createTransport({
    host: "premium283.web-hosting.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@hust.edu.ng", // your cPanel email address
      pass: "password goes here", // your cPanel email password
    },
  });

  try {
    const info = await transporter.sendMail({
      from: "info@hust.edu.ng",
      to: email,
      subject: subject,
      html: text,
    });

    console.log("Response:", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendMail;
