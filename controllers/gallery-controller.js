const { db } = require("../configs/db");
const asyncHandler = require("express-async-handler");

const addgallery = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;

  const { title } = req.body;

  if (!title || !req.file) {
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
        const image = req.file.filename;
        const createdBy = `${firstname} , ${lastname}`;
        const publish = 1;
        const query2 =
          "INSERT INTO gallery (title, publish, createdBy, image) VALUES (?,?,?,?) ";
        const values = [title, publish, createdBy, image];

        db.query(query2, values, (err, results) => {
          if (err) {
            res.status(400).json({ message: `Failed to add gallery ${err}` });
          } else {
            res.status(200).json({ message: "gallery Added Successfully" });
          }
        });
      }
    });
  }
});

const getAllPublishedgallery = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM gallery WHERE publish = ?";
  const values = [1];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const getAllUnPublishedgallery = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM gallery WHERE publish = ?";
  const values = [0];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const getSinglegallery = asyncHandler(async (req, res) => {
  const galleryId = req.params.galleryId;

  db.query(
    "SELECT * FROM admin Where id = ? LIMIT 1",
    [galleryId],
    (error, response) => {
      if (error) {
        res.status(400).json("database error");
      } else {
        res.status(200).json(response);
      }
    }
  );
});

const editSinglegallery = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const galleryId = req.params.galleryId;

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
    "UPDATE gallery SET " + updates.map((update) => `?? = ?`).join(", ");
  const values = updates.reduce(
    (acc, update) => [...acc, update.columnName, update.newValue],
    []
  );

  query += " WHERE id = ?";
  values.push(galleryId);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      res.status(500).json("Error updating admin info: " + err);
    } else {
      console.log("gallery info updated successfully");
      res.json(results);
    }
  });
});

const deleteSinglegallery = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const galleryId = req.params.galleryId;

  if (adminId != adminIdFromAuth) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query = "DELETE FROM gallery WHERE id = ?";
  const values = [galleryId];

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

const togglePublishState = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const galleryId = req.params.galleryId;

  if (adminIdFromAuth != adminId) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query =
    "UPDATE gallery SET publish = CASE WHEN publish = 1 THEN 0 ELSE 1 END WHERE id = ?";
  const values = [galleryId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      res.status(500).json("Error updating admin info: " + err);
    } else {
      console.log("gallery info updated successfully");
      res.json(results);
    }
  });
});

module.exports = {
  addgallery,
  getAllPublishedgallery,
  getAllUnPublishedgallery,
  getSinglegallery,
  editSinglegallery,
  deleteSinglegallery,
  togglePublishState,
};
