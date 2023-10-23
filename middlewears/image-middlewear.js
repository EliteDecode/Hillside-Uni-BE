const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "cover_Image") {
      cb(null, "public/images");
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "cover_Image") {
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

const imageStorageMiddlewear = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
}).single("cover_Image");

module.exports = {
  imageStorageMiddlewear,
};
