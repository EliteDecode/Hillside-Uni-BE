const { db } = require("../configs/db");
const asyncHandler = require("express-async-handler");

const addSchools = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;

  const { name, college } = req.body;

  if (!name || !college) {
    res.status(400);
    throw new Error("All fields are compulsory");
  }

  if (adminIdFromAuth != adminId) {
    res.status(400);
    throw new Error("Not Authorized");
  } else {
    const query1 = "SELECT firstname, lastname FROM admin WHERE id =? ";

    db.query(query1, [adminId], (err, results) => {
      if (err) {
        res
          .status(400)
          .json({ message: `Error in fetching user data: ${err}` });
      } else {
        const firstname = results[0].firstname;
        const lastname = results[0].lastname;
        const createdBy = `${firstname} , ${lastname}`;
        const school = `School of ${name}`;
        const publish = 1;
        const query2 =
          "INSERT INTO schools (name, school, college, publish, createdBy) VALUES (?,?,?,?,?) ";
        const values = [name, school, college, publish, createdBy];

        db.query(query2, values, (err, results) => {
          if (err) {
            res.status(400).json({ message: `Failed to add schools ${err}` });
          } else {
            res.status(200).json({ message: "Schools Added Successfully" });
          }
        });
      }
    });
  }
});

const getAllPublishedSchools = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM schools WHERE publish = ?";
  const values = [1];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const getAllUnPublishedSchools = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM schools WHERE publish = ?";
  const values = [0];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const getSingleSchools = asyncHandler(async (req, res) => {
  const schoolsId = req.params.schoolsId;

  db.query(
    "SELECT * FROM schools Where id = ? LIMIT 1",
    [schoolsId],
    (error, response) => {
      if (error) {
        res.status(400).json("database error");
      } else {
        res.status(200).json(response);
      }
    }
  );
});

const editSingleSchools = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const schoolsId = req.params.schoolsId;

  if (adminIdFromAuth != adminId) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  const updates = req.body;
  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400);
    throw new Error("You can't submit empty fields");
  }
  if (req.file) {
    updates.push({ image: req.file.fieldname });
  }

  let query =
    "UPDATE schools SET " + updates.map((update) => `?? = ?`).join(", ");
  const values = updates.reduce(
    (acc, update) => [...acc, update.columnName, update.newValue],
    []
  );

  query += " WHERE id = ?";
  values.push(schoolsId);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating school info: " + err);
      res.status(500).json("Error updating school info: " + err);
    } else {
      console.log("Schools info updated successfully");
      res.json(results);
    }
  });
});

const deleteSingleSchools = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const schoolsId = req.params.schoolsId;

  if (adminId != adminIdFromAuth) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query = "DELETE FROM schools WHERE id = ?";
  const values = [schoolsId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error deleting admin: " + err);
      res.status(500).json("Error deleting admin: " + err);
    } else {
      res.json({ message: "College deleted successfully" });
    }
  });
});

const togglePublishState = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const schoolsId = req.params.schoolsId;

  if (adminIdFromAuth != adminId) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query =
    "UPDATE schools SET publish = CASE WHEN publish = 1 THEN 0 ELSE 1 END WHERE id = ?";
  const values = [schoolsId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      res.status(500).json("Error updating admin info: " + err);
    } else {
      console.log("Schools info updated successfully");
      res.json(results);
    }
  });
});

module.exports = {
  addSchools,
  getAllPublishedSchools,
  getAllUnPublishedSchools,
  getSingleSchools,
  editSingleSchools,
  deleteSingleSchools,
  togglePublishState,
};
