const { db } = require("../configs/db");
const asyncHandler = require("express-async-handler");

const addNews = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;

  const { title, description } = req.body;

  if (!title || !description || !req.file) {
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
          "INSERT INTO news (title, description, publish, createdBy, image) VALUES (?,?,?,?,?) ";
        const values = [title, description, publish, createdBy, image];

        db.query(query2, values, (err, results) => {
          if (err) {
            res.status(400).json({ message: `Failed to add news ${err}` });
          } else {
            res.status(200).json({ message: "News Added Successfully" });
          }
        });
      }
    });
  }
});

const getAllPublishedNews = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM news WHERE publish = ?";
  const values = [1];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const getAllUnPublishedNews = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM news WHERE publish = ?";
  const values = [0];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const getSingleNews = asyncHandler(async (req, res) => {
  const newsId = req.params.newsId;

  db.query("SELECT * FROM news Where id = ?", [newsId], (error, response) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(response);
    }
  });
});

const editSingleNews = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const newsId = req.params.newsId;

  if (adminIdFromAuth != adminId) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  const updates = JSON.parse(req.body.updates);
  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400);
    throw new Error("You can't submit empty fields");
  }
  if (req.file) {
    updates.push({ columnName: "image", newValue: req.file.filename });
  }

  let query = "UPDATE news SET " + updates.map((update) => `?? = ?`).join(", ");
  const values = updates.reduce(
    (acc, update) => [...acc, update.columnName, update.newValue],
    []
  );

  query += " WHERE id = ?";
  values.push(newsId);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      res.status(500).json("Error updating admin info: " + err);
    } else {
      console.log("news info updated successfully");
      res.json(results);
    }
  });
});
const deleteSingleNews = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const newsId = req.params.newsId;

  if (adminId != adminIdFromAuth) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query = "DELETE FROM news WHERE id = ?";
  const values = [newsId];

  console.log(newsId);

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
  const newsId = req.params.newsId;

  if (adminIdFromAuth != adminId) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query =
    "UPDATE news SET publish = CASE WHEN publish = 1 THEN 0 ELSE 1 END WHERE id = ?";
  const values = [newsId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      res.status(500).json("Error updating admin info: " + err);
    } else {
      console.log("News info updated successfully");
      res.json(results);
    }
  });
});

module.exports = {
  addNews,
  getAllPublishedNews,
  getAllUnPublishedNews,
  getSingleNews,
  editSingleNews,
  deleteSingleNews,
  togglePublishState,
};
