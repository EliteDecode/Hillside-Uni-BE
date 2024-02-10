const { db } = require("../configs/db");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/token");
const { v4: uuidv4 } = require("uuid");
const sendMail = require("../utils/email");
const emailRegex = /^[a-zA-Z0-9._-]+@hust\.edu\.ng$/;

const login = (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);
  const sql = "SELECT * FROM staff WHERE email = ?";

  if (!emailRegex.test(email)) {
    res
      .status(400)
      .json({ error: "Please use your official provided school email" });
    return;
  }
  db.query(sql, [email], (error, response) => {
    if (error) {
      res.status(500).json({ error: error });
    } else if (response.length > 0) {
      const hashedPassword = response[0].password;
      bcrypt.compare(password, hashedPassword, (compareError, isMatch) => {
        if (compareError) {
          res.status(500).json({ error: "Password comparison error" });
        } else if (isMatch) {
          res.status(200).json({
            data: response[0],
            token: generateToken(response[0].id),
          });
        } else {
          res.status(401).json({ error: "Login failed. Invalid credentials." });
        }
      });
    } else {
      res.status(401).json({ error: "Login failed. Invalid credentials." });
    }
  });
};

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, confirmPassword, username } =
    req.body;

  try {
    if (
      !email ||
      !password ||
      !firstname ||
      !lastname ||
      !confirmPassword ||
      !username
    ) {
      res.status(400).json({ error: "Provide all credentials" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords must match" });
      return;
    }

    if (!emailRegex.test(email)) {
      res
        .status(400)
        .json({ error: "Please use your official provided school email" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);
    const IdCardStatus = 0;

    const userExistQuery =
      "SELECT * FROM staff WHERE email = ? OR username = ? ";

    db.query(userExistQuery, [email, username], async (error, result) => {
      if (error) {
        res.status(500).json({ error: error });
      } else if (result.length > 0) {
        res
          .status(400)
          .json({ error: "Staff with this email or username already exists" });
      } else {
        const addUserQuery =
          "INSERT INTO staff (firstname, lastname, username, email, password, unHashedPassword, createdAt) VALUES (?, ?, ?, ?, ?, ?, ? , ?)";

        db.query(
          addUserQuery,
          [
            firstname,
            lastname,
            username,
            email,
            hashedPwd,
            password,
            IdCardStatus,
            Date.now(),
          ],
          async (error, result) => {
            if (error) {
              res.status(500).json({ error: error });
            } else {
              const sql = "SELECT * FROM staff WHERE email = ? LIMIT 1";
              db.query(sql, [email], async (error, response) => {
                if (error) {
                  res.status(500).json({ error: error });
                } else if (response.length > 0) {
                  const currentUrl = "https://staff.hust.edu.ng/";
                  const UniqueString = uuidv4() + response[0].id;
                  const salt2 = await bcrypt.genSalt(10);
                  const hashedString = await bcrypt.hash(UniqueString, salt2);

                  const pendingStaffQuery =
                    "INSERT INTO pendingStaff (staffId, uniqueString, createdAt, expiresAt) VALUES (?, ?, ?, ?)";
                  const url = `${currentUrl}verify/${response[0].id}/${UniqueString}`;

                  db.query(
                    pendingStaffQuery,
                    [
                      response[0].id,
                      UniqueString,
                      Date.now(),
                      Date.now() + 300000,
                    ],
                    async (error, response) => {
                      if (error) {
                        res.status(500).json({ error: error });
                      } else {
                        try {
                          await sendMail(
                            email,
                            "Verification Email",
                            `<p> Please Verify your account by clicking <a href='${url}'>here</a> this link will expire in the next 5 minutes </p>`
                          );
                          res.status(200).json({
                            message: "Verification email sent successfully",
                          });
                        } catch (error) {
                          const deleteStaffQuery =
                            "DELETE FROM staff WHERE id = ?";
                          db.query(
                            deleteStaffQuery,
                            [response[0].id],
                            async (error, result) => {
                              if (error) {
                                res.status(500).json({ error: error });
                              } else {
                                const deleteStaffTokenQuery =
                                  "DELETE FROM pendingStaff WHERE staffId = ?";
                                db.query(
                                  deleteStaffTokenQuery,
                                  [response[0].id],
                                  (err, result) => {
                                    if (err) {
                                      res.status(500).json({
                                        error:
                                          "Verification Email could not be sent",
                                      });
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    }
                  );
                }
              });
            }
          }
        );
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const deleteUserIfDelayed = asyncHandler(async (req, res) => {
  const cutoff = Date.now() - 300000; // 5 minutes ago
  db.query(
    "DELETE FROM staff WHERE createdAt <= ? AND verified = ?",
    [cutoff, 0],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        db.query(
          "DELETE FROM pendingStaff WHERE createdAt <= ?",
          [cutoff],
          (err, result) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    },
    []
  );
});

const verifyStaff = asyncHandler(async (req, res) => {
  const { staffId, uniqueString } = req.params;

  db.query(
    "SELECT * FROM pendingStaff WHERE staffId = ? AND uniqueString = ?",
    [staffId, uniqueString],
    (error, pendingStaffResult) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
        return;
      }

      if (!pendingStaffResult || pendingStaffResult.length === 0) {
        res.status(400);
        res.json({ error: "Verification Failed, invalid verification link" });
        return;
      }

      const { createdAt, expiresAt } = pendingStaffResult[0];

      if (expiresAt < Date.now()) {
        // Token has expired, delete user and token
        db.query("DELETE FROM staff WHERE id = ?", [staffId], (error) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: "Database error" });
            return;
          }

          db.query(
            "DELETE FROM pendingStaff WHERE staffId = ?",
            [staffId],
            (error) => {
              if (error) {
                console.error(error);
                res.status(500).json({ error: "Database error" });
                return;
              }

              res.status(400);
              res.json({
                error:
                  "Verification Failed, verification link expired. Please try to sign up again.",
              });
            }
          );
        });
      } else {
        // Update the user as verified
        db.query(
          "UPDATE staff SET verified = ? WHERE id = ?",
          [1, staffId],
          (error) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: "Database error" });
              return;
            }

            // Delete the token
            db.query(
              "DELETE FROM pendingStaff WHERE staffId = ?",
              [staffId],
              (error) => {
                if (error) {
                  console.error(error);
                  res.status(500).json({ error: "Database error" });
                  return;
                }

                // Fetch the verified user
                db.query(
                  "SELECT * FROM staff WHERE id = ?",
                  [staffId],
                  (error, verifiedUserResult) => {
                    if (error) {
                      console.error(error);
                      res.status(500).json({ error: "Database error" });
                      return;
                    }

                    if (verifiedUserResult && verifiedUserResult.length > 0) {
                      const verifiedUser = verifiedUserResult[0];
                      res.json({
                        id: verifiedUser.id,
                        firstname: verifiedUser.firstname,
                        lastname: verifiedUser.lastname,
                        email: verifiedUser.email,
                        unhashedPassword: verifiedUser.unHashedPassword,
                      });
                    }
                  }
                );
              }
            );
          }
        );
      }
    }
  );
});

const changePassword = asyncHandler(async (req, res) => {
  const staffId = req.staff.id;
  const singleStaffId = req.params.singleStaffId;

  const { oldPassword, newPassword } = req.body;

  if (staffId != singleStaffId) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("All Fields are compulsory");
  }
  const query = "SELECT password FROM staff WHERE id = ?";
  const values = [singleStaffId];

  db.query(query, values, async (err, results) => {
    if (err) {
      console.error("Error querying password: " + err);
    } else if (results.length === 1) {
      const storedPassword = results[0].password;

      const passwordMatch = await bcrypt.compare(oldPassword, storedPassword);

      if (passwordMatch) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const updateQuery = "UPDATE staff SET password = ? WHERE id = ?";
        const values = [hashedPassword, singleStaffId];

        db.query(updateQuery, values, (updateErr, updateResults) => {
          if (updateErr) {
            res
              .status(500)
              .json({ message: `Error changing Password: ${updateErr}` });
          } else {
            res.status(200).json(updateResults);
          }
        });
      } else {
        res.status(401).json({ message: `Old Password does not match` });
      }
    } else {
      res.status(400).json({ message: `User not found` });
    }
  });
});

const editStaff = asyncHandler(async (req, res) => {
  const id = req.staff.id;
  const staffId = req.params.staffId;

  if (id != staffId) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  const updates = JSON.parse(req.body.updates);

  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400);
    throw new Error("You can't submit empty fields");
  }
  if (req.file) {
    updates.push({ columnName: "profilePicture", newValue: req.file.filename });
  }

  let query =
    "UPDATE staff SET " + updates.map((update) => `?? = ?`).join(", ");
  const values = updates.reduce(
    (acc, update) => [...acc, update.columnName, update.newValue],
    []
  );

  query += " WHERE id = ?";
  values.push(staffId);
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      return res.status(400).json(err);
    } else {
      const sql = "SELECT * FROM staff WHERE id = ?";

      db.query(sql, [id], (err, response) => {
        if (err) {
          return res.status(400).json(err);
        } else {
          res.status(200).json({
            data: response[0],
            token: generateToken(response[0].id),
          });
        }
      });
    }
  });
});

module.exports = {
  login,
  register,
  verifyStaff,
  deleteUserIfDelayed,
  changePassword,
  editStaff,
};
