const jwt = require("jsonwebtoken");
const { db } = require("../configs/db");

const mainAdminProtectRoute = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Split the string into an array and extract the token.
      token = req.headers.authorization.split(" ")[1];

      // Verify the JWT token using your secret key.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const query =
        "SELECT id, firstname, lastname, email FROM admin WHERE id = ? AND main = ?";

      db.query(query, [decoded.id, 1], (error, results) => {
        if (error) {
          console.error("Database error:", error);
          return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 1) {
          req.admin = {
            id: results[0].id,
            firstname: results[0].firstname,
            lastname: results[0].lastname,
            email: results[0].email,
          };
          return next();
        }

        return res.status(401).json({ error: "Invalid access credentials" });
      });
    } catch (error) {
      console.error("JWT verification error:", error);
      res.status(401).json({ error: "Not authorized" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

const ProtectRoute = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Split the string into an array and extract the token.
      token = req.headers.authorization.split(" ")[1];

      // Verify the JWT token using your secret key.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const query =
        "SELECT id, firstname, lastname, email FROM admin WHERE id = ?";

      db.query(query, [decoded.id], (error, results) => {
        if (error) {
          console.error("Database error:", error);
          return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 1) {
          req.admin = {
            id: results[0].id,
            firstname: results[0].firstname,
            lastname: results[0].lastname,
            email: results[0].email,
          };
          return next();
        }

        return res.status(401).json({ error: "Invalid access credentials" });
      });
    } catch (error) {
      console.error("JWT verification error:", error);
      res.status(401).json({ error: "Not authorized" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

module.exports = { mainAdminProtectRoute, ProtectRoute };
