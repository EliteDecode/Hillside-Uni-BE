const { db } = require("../configs/db");
const asyncHandler = require("express-async-handler");
const sendMail = require("../utils/email");

const sendMessageToAdmin = asyncHandler(async (req, res) => {
  const { email, title, message, fullName } = req.body;

  if (!email || !title || !message || !fullName) {
    res.status(400);
    throw new Error("All fields are required");
  } else {
    await sendMail(
      email,
      title,
      `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
      <p style="font-weight: bold;">Message from:</p>
      <p>${fullName}</p>
      <p style="font-weight: bold;">Message Content:</p>
      <p>${message}</p>
   </div>`
    )
      .then((data) => {
        console.log(data);
        res
          .status(200)
          .json({ message: "Verification email sent successfully" });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json("Verification Email could not be sent");
      });
  }
});

module.exports = {
  sendMessageToAdmin,
};
