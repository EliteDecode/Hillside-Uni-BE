const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { connectDb } = require("./configs/db");
const colors = require("colors");
const { errorHandler } = require("./middlewears/error-middlewear");
const { deleteUserIfDelayed } = require("./controllers/staff-controllers");

connectDb();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/hust/api/v1/admin", require("./routes/admin-route"));
app.use("/hust/api/v1/staff", require("./routes/staff-routes"));
app.use("/hust/api/v1/test", require("./routes/test"));
app.use("/hust/api/v1/news", require("./routes/news-route"));
app.use("/hust/api/v1/events", require("./routes/events-route"));
app.use("/hust/api/v1/gallery", require("./routes/gallery-route"));
app.use("/hust/api/v1/colleges", require("./routes/colleges-route"));
app.use("/hust/api/v1/schools", require("./routes/schools-route"));
app.use("/hust/api/v1/department", require("./routes/department-route"));
app.use("/hust/api/v1/message", require("./routes/message-route"));
app.use(
  "/hust/api/v1/academic-calender",
  require("./routes/academic-calender-route")
);
app.use("/hust/api/v1/uploads", express.static(__dirname + "/uploads"));
// app.use(
//   "/hust/api/v1/uploads/staffProfile",
//   express.static(__dirname + "/uploads")
// );
app.use(express.static("public"));
setInterval(deleteUserIfDelayed, 60 * 1000); // Run every minute

app.use(errorHandler);
app.listen(process.env.PORT, () =>
  console.log(`Server running at ${process.env.PORT}`)
);
