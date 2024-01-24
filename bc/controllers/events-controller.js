const { db } = require("../configs/db");
const asyncHandler = require("express-async-handler");

const addevents = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;

  const { title, description, publish, date } = req.body;
  console.log(req.body);

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

        const query2 =
          "INSERT INTO events (title, description, publish, createdBy, image, eventsDate) VALUES (?,?,?,?,?,?) ";
        const values = [title, description, publish, createdBy, image, date];

        db.query(query2, values, (err, results) => {
          if (err) {
            res.status(400).json({ message: `Failed to add events ${err}` });
          } else {
            res.status(200).json({ message: "events Added Successfully" });
          }
        });
      }
    });
  }
});

const getAllPublishedevents = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM events ORDER BY createdAt DESC ";
  const values = [1];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const getAllUnPublishedevents = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM events WHERE publish = ?";
  const values = [0];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const getSingleevents = asyncHandler(async (req, res) => {
  const eventsId = req.params.eventsId;

  db.query(
    "SELECT * FROM events Where id = ? ",
    [eventsId],
    (error, response) => {
      if (error) {
        res.status(400).json("database error");
      } else {
        res.status(200).json(response);
      }
    }
  );
});

const editSingleevents = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const eventsId = req.params.eventsId;

  if (adminIdFromAuth != adminId) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  console.log(req.body);
  const updates = JSON.parse(req.body.updates);
  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400);
    throw new Error("You can't submit empty fields");
  }
  if (req.file) {
    updates.push({ columnName: "image", newValue: req.file.filename });
  }

  let query =
    "UPDATE events SET " + updates.map((update) => `?? = ?`).join(", ");
  const values = updates.reduce(
    (acc, update) => [...acc, update.columnName, update.newValue],
    []
  );

  query += " WHERE id = ?";
  values.push(eventsId);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      res.status(500).json("Error updating admin info: " + err);
    } else {
      console.log("events info updated successfully");
      res.json(results);
    }
  });
});

const deleteSingleevents = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const eventsId = req.params.eventsId;

  if (adminId != adminIdFromAuth) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query = "DELETE FROM events WHERE id = ?";
  const values = [eventsId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error deleting admin: " + err);
      res.status(500).json("Error deleting admin: " + err);
    } else if (results) {
      res.status(200).json({ message: "Admin deleted successfully" });
    }
  });
});

const togglePublishState = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const eventsId = req.params.eventsId;

  if (adminIdFromAuth != adminId) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query =
    "UPDATE events SET publish = CASE WHEN publish = 1 THEN 0 ELSE 1 END WHERE id = ?";
  const values = [eventsId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      res.status(500).json("Error updating admin info: " + err);
    } else {
      console.log("events info updated successfully");
      res.json(results);
    }
  });
});

module.exports = {
  addevents,
  getAllPublishedevents,
  getAllUnPublishedevents,
  getSingleevents,
  editSingleevents,
  deleteSingleevents,
  togglePublishState,
};
