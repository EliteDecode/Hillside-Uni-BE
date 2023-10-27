const { db } = require("../configs/db");
const asyncHandler = require("express-async-handler");

const addAcademicCalender = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const calendarData = req.body;

  if (!Array.isArray(calendarData) || calendarData.length === 0) {
    res.status(400).json({ error: "Invalid or missing 'calendar' data" });
    return;
  }

  if (adminIdFromAuth != adminId) {
    res.status(401).json({ error: "Not Authorized" });
    return;
  }

  // Fetch the admin's name for createdBy field
  const query1 = "SELECT firstname, lastname FROM admin WHERE id = ?";
  db.query(query1, [adminId], (err, results) => {
    if (err) {
      res.status(400).json({ error: `Error in fetching user data: ${err}` });
      return;
    } else {
      const firstname = results[0].firstname;
      const lastname = results[0].lastname;
      const createdBy = `${firstname} ${lastname}`;

      // Iterate through the calendarData and insert each academic record
      for (const academicRecord of calendarData) {
        const { title, description, startDate, endDate, calenderYear } =
          academicRecord;
        const publish = 1;

        const query2 =
          "INSERT INTO academiccalender (calenderYear, title, description, publish, createdBy, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [
          calenderYear,
          title,
          description,
          publish,
          createdBy,
          startDate,
          endDate,
        ];

        db.query(query2, values, (err, results) => {
          if (err) {
            console.error(`Failed to add academic: ${err}`);
            // Handle the error appropriately (e.g., log the error and continue).
          } else {
          }
        });
      }
      res.status(200).json({ message: "Academic Calender Added Successfully" });
    }
  });
});

const getAllPublishedAcademicCalender = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM academiccalender WHERE publish = ?";
  const values = [1];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const getAllUnPublishedAcademicCalender = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM academiccalender WHERE publish = ?";
  const values = [0];

  db.query(query, values, (error, result) => {
    if (error) {
      res.status(400).json("database error");
    } else {
      res.status(200).json(result);
    }
  });
});

const getSingleAcademicCalender = asyncHandler(async (req, res) => {
  const academicCalenderId = req.params.academicCalenderId;

  db.query(
    "SELECT * FROM admin Where id = ? LIMIT 1",
    [academicCalenderId],
    (error, response) => {
      if (error) {
        res.status(400).json("database error");
      } else {
        res.status(200).json(response);
      }
    }
  );
});

const editSingleAcademicCalender = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const academicCalenderId = req.params.academicCalenderId;

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
    "UPDATE academiccalender SET " +
    updates.map((update) => `?? = ?`).join(", ");
  const values = updates.reduce(
    (acc, update) => [...acc, update.columnName, update.newValue],
    []
  );

  query += " WHERE id = ?";
  values.push(academicCalenderId);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      res.status(500).json("Error updating admin info: " + err);
    } else {
      console.log("AcademicCalender info updated successfully");
      res.json(results);
    }
  });
});

const deleteSingleAcademicCalender = asyncHandler(async (req, res) => {
  const adminIdFromAuth = req.admin.id;
  const adminId = req.params.adminId;
  const academicCalenderId = req.params.academicCalenderId;

  if (adminId != adminIdFromAuth) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query = "DELETE FROM academiccalender WHERE id = ?";
  const values = [academicCalenderId];

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
  const academicCalenderId = req.params.academicCalenderId;

  if (adminIdFromAuth != adminId) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const query =
    "UPDATE AcademicCalender SET publish = CASE WHEN publish = 1 THEN 0 ELSE 1 END WHERE id = ?";
  const values = [academicCalenderId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating admin info: " + err);
      res.status(500).json("Error updating admin info: " + err);
    } else {
      console.log("AcademicCalender info updated successfully");
      res.json(results);
    }
  });
});

module.exports = {
  addAcademicCalender,
  getAllPublishedAcademicCalender,
  getAllUnPublishedAcademicCalender,
  getSingleAcademicCalender,
  editSingleAcademicCalender,
  deleteSingleAcademicCalender,
  togglePublishState,
};
