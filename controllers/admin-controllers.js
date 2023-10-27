const { db } = require("../configs/db");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/token");

const login = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM admin WHERE email = ?";

  db.query(sql, [email], (error, response) => {
    if (error) {
      res.status(500).json({ error: "Database error" });
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
  const { email, password, firstname, lastname, confirmPassword } = req.body;

  try {
    if (!email || !password || !firstname || !lastname || !confirmPassword) {
      res.status(400).json({ error: "Provide all credentials" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords must match" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    const userExistQuery = "SELECT * FROM admin WHERE email = ? ";

    db.query(userExistQuery, [email], (error, result) => {
      if (error) {
        res.status(500).json({ error: "Database error" });
      } else if (result.length > 0) {
        res.status(400).json({ error: "Admin with this email already exists" });
      } else {
        const addUserQuery =
          "INSERT INTO admin (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";

        db.query(
          addUserQuery,
          [firstname, lastname, email, hashedPwd],
          (error, result) => {
            if (error) {
              res.status(500).json({ error: "Admin could not be created" });
            } else {
              const sql = "SELECT * FROM admin WHERE email = ?";
              db.query(sql, [email], (error, response) => {
                if (error) {
                  console.log(error);
                  res.status(500).json({ error: "Database error" });
                } else if (response.length > 0) {
                  res.status(200).json({
                    message: "Admin created successfully",
                    data: response,
                  });
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

const getAllAdminsByMain = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const id = req.params.id;

  if (adminId != id) {
    res.status(400);
    throw new Error("Not Authorized");
  } else {
    db.query(
      "SELECT * FROM admin WHERE id != ?",
      [adminId],
      (error, response) => {
        if (error) {
          res.status(400).json("database error");
        } else {
          res.status(200).json(response);
        }
      }
    );
  }
});

const getSingleAdminByMain = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const id = req.params.id;

  const singleAdminId = req.params.singleAdminId;

  if (adminId != id) {
    res.status(400);
    throw new Error("Not Authorized");
  } else {
    db.query(
      "SELECT * FROM admin Where id = ? LIMIT 1",
      [singleAdminId],
      (error, response) => {
        if (error) {
          res.status(400).json("database error");
        } else {
          res.status(200).json(response);
        }
      }
    );
  }
});

const getSingleAdmin = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const id = req.params.id;

  if (adminId != id) {
    res.status(400);
    throw new Error("Not Authorized");
  } else {
    db.query(
      "SELECT * FROM admin Where id = ? LIMIT 1",
      [id],
      (error, response) => {
        if (error) {
          res.status(400).json("database error");
        } else {
          res.status(200).json(response);
        }
      }
    );
  }
});

const editSingleAdminByMain = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const id = req.params.id;
  const singleAdminId = req.params.id;

  if (adminId != id) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const updates = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400); // Bad Request
    throw new Error("Invalid or missing 'updates' data");
  }

  let query =
    "UPDATE admin SET " + updates.map((update) => `?? = ?`).join(", ");
  const values = updates.reduce(
    (acc, update) => [...acc, update.columnName, update.newValue],
    []
  );
  query += " WHERE id = ?";
  values.push(singleAdminId);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      res.status(500).json("Error updating admin info: " + err);
    } else {
      console.log("Admin info updated successfully");
      res.json(results);
    }
  });
});

const editSingleAdmin = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const id = req.params.id;

  if (adminId != id) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  const updates = req.body;
  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400);
    throw new Error("Invalid or missing 'updates' data");
  }

  let query =
    "UPDATE admin SET " + updates.map((update) => `?? = ?`).join(", ");
  const values = updates.reduce(
    (acc, update) => [...acc, update.columnName, update.newValue],
    []
  );

  query += " WHERE id = ?";
  values.push(id);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      res.status(500).json("Error updating admin info: " + err);
    } else {
      console.log("Admin info updated successfully");
      res.json(results);
    }
  });
});

const deleteSingleAdmin = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const id = req.params.id;
  const singleAdminId = req.params.singleAdminId;
  if (adminId != id) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query = "DELETE FROM admin WHERE id = ?";
  const values = [singleAdminId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error deleting admin: " + err);
      res.status(500).json("Error deleting admin: " + err);
    } else {
      console.log("Admin deleted successfully");
      res.json({ message: "Admin deleted successfully" });
    }
  });
});

const changePasswordByMain = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const id = req.params.id;
  const singleAdminId = req.params.singleAdminId;

  const { oldPassword, newPassword } = req.body;

  if (adminId != id) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("All Fields are compulsory");
  }
  const query = "SELECT password FROM admin WHERE id = ?";
  const values = [singleAdminId];

  db.query(query, values, async (err, results) => {
    if (err) {
      console.error("Error querying password: " + err);
    } else if (results.length === 1) {
      const storedPassword = results[0].password;

      const passwordMatch = await bcrypt.compare(oldPassword, storedPassword);

      if (passwordMatch) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const updateQuery = "UPDATE admin SET password = ? WHERE id = ?";
        const values = [hashedPassword, singleAdminId];

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

const changePassword = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const id = req.params.id;
  const singleAdminId = req.params.singleAdminId;

  const { oldPassword, newPassword } = req.body;

  if (adminId != id) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("All Fields are compulsory");
  }
  const query = "SELECT password FROM admin WHERE id = ?";
  const values = [singleAdminId];

  db.query(query, values, async (err, results) => {
    if (err) {
      console.error("Error querying password: " + err);
    } else if (results.length === 1) {
      const storedPassword = results[0].password;

      const passwordMatch = await bcrypt.compare(oldPassword, storedPassword);

      if (passwordMatch) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const updateQuery = "UPDATE admin SET password = ? WHERE id = ?";
        const values = [hashedPassword, singleAdminId];

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

module.exports = {
  login,
  register,
  getAllAdminsByMain,
  getSingleAdminByMain,
  editSingleAdminByMain,
  getSingleAdmin,
  editSingleAdmin,
  deleteSingleAdmin,
  changePassword,
  changePasswordByMain,
};
