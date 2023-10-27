const { db } = require("../configs/db");
const asyncHandler = require("express-async-handler");

const addColleges = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;

  const { name } = req.body;

  console.log(req.file);

  if (!name || !req.file) {
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
        const imageUrl = req.file.filename;
        const createdBy = `${firstname} , ${lastname}`;
        const college = `COLLEGE OF ${name}`;
        const publish = 1;
        const query2 =
          "INSERT INTO colleges (name, college, publish, createdBy, imageUrl) VALUES (?,?,?,?,?) ";
        const values = [
          name.toUpperCase(),
          college.toUpperCase(),
          publish,
          createdBy,
          imageUrl,
        ];

        db.query(query2, values, (err, results) => {
          if (err) {
            res.status(400).json({ message: `Failed to add colleges ${err}` });
          } else {
            res.status(200).json({ message: "Colleges Added Successfully" });
          }
        });
      }
    });
  }
});

const getAllPublishedColleges = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM colleges WHERE publish = ?";
  const values = [1];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const getAllUnPublishedColleges = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM colleges WHERE publish = ?";
  const values = [0];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const getSingleColleges = asyncHandler(async (req, res) => {
  const collegesId = req.params.collegesId;

  db.query(
    "SELECT * FROM colleges Where id = ? LIMIT 1",
    [collegesId],
    (error, response) => {
      if (error) {
        res.status(400).json("database error");
      } else {
        res.status(200).json(response);
      }
    }
  );
});

const editSingleColleges = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const collegesId = req.params.collegesId;

  if (adminIdFromAuth != adminId) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  const updates = req.body;
  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400);
    throw new Error("Invalid or missing 'updates' data");
  }
  if (req.file) {
    updates.push({ image: req.file.fieldname });
  }

  let query =
    "UPDATE colleges SET " + updates.map((update) => `?? = ?`).join(", ");
  const values = updates.reduce(
    (acc, update) => [...acc, update.columnName, update.newValue],
    []
  );

  query += " WHERE id = ?";
  values.push(collegesId);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating college info: " + err);
      res.status(500).json("Error updating college info: " + err);
    } else {
      console.log("Colleges info updated successfully");
      res.json(results);
    }
  });
});

const deleteSingleColleges = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const collegesId = req.params.collegesId;

  if (adminId != adminIdFromAuth) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query = "DELETE FROM colleges WHERE id = ?";
  const values = [collegesId];

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
  const collegesId = req.params.collegesId;

  if (adminIdFromAuth != adminId) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query =
    "UPDATE colleges SET publish = CASE WHEN publish = 1 THEN 0 ELSE 1 END WHERE id = ?";
  const values = [collegesId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      res.status(500).json("Error updating admin info: " + err);
    } else {
      console.log("Colleges info updated successfully");
      res.json(results);
    }
  });
});

module.exports = {
  addColleges,
  getAllPublishedColleges,
  getAllUnPublishedColleges,
  getSingleColleges,
  editSingleColleges,
  deleteSingleColleges,
  togglePublishState,
};
