const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { connectDb } = require("./configs/db");
const colors = require("colors");
const { errorHandler } = require("./middlewears/error-middlewear");

connectDb();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/hust/api/v1/admin", require("./routes/admin-route"));
app.use("/hust/api/v1/news", require("./routes/news-route"));
app.use("/hust/api/v1/events", require("./routes/events-route"));
app.use("/hust/api/v1/gallery", require("./routes/gallery-route"));
app.use("/hust/api/v1/academics", require("./routes/academic-route"));

app.use(errorHandler);
app.listen(process.env.PORT, () =>
  console.log(`Server running at ${process.env.PORT}`)
);