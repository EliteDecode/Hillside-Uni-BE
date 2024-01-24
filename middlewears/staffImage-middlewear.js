const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profilePicture") {
      cb(null, "uploads/staffProfile");
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "profilePicture") {
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    } else if (file.fieldname === "natid") {
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
  },
});

let fileFilter = function (req, file, cb) {
  var allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      {
        success: false,
        message: "Invalid file type. Only jpg, png image files are allowed.",
      },
      false
    );
  }
};

const staffImageStorageMiddlewear = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
}).single("profilePicture");

module.exports = {
  staffImageStorageMiddlewear,
};
