const { db } = require("../configs/db");
const asyncHandler = require("express-async-handler");

const addSubscribers = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  // Check if the email is already subscribed
  const checkQuery = "SELECT * FROM subscribers WHERE email = ?";
  const checkValues = [email];

  db.query(checkQuery, checkValues, (checkErr, checkResults) => {
    if (checkErr) {
      res.status(500).json({ message: "Error checking email subscription" });
    } else if (checkResults.length > 0) {
      // Email is already subscribed
      res.status(400).json({ message: "Email is already subscribed" });
    } else {
      // Email is not subscribed, insert it
      const insertQuery = "INSERT INTO subscribers (email) VALUES (?)";
      const insertValues = [email];

      db.query(insertQuery, insertValues, (err, results) => {
        if (err) {
          res.status(500).json({ message: "Failed to add subscriber" });
        } else {
          res.status(200).json({
            message: "You have successfully subscribed to HUST Newsletter",
          });
        }
      });
    }
  });
});

const getSubscribers = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM subscribers ";
  const values = [1];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const deleteSubscriber = asyncHandler(async (req, res) => {
  const query = "DELETE FROM subscribers WHERE id = ?";
  const value = req.params.subscriberId;

  db.query(query, value, (err, results) => {
    if (err) {
      console.error("Error deleting admin: " + err);
      res.status(500).json("Error deleting admin: " + err);
    } else {
      res.json({ message: "College deleted successfully" });
    }
  });
});

module.exports = {
  deleteSubscriber,
  getSubscribers,
  addSubscribers,
};
