const express = require("express");
const staffController = require("../controllers/staff-controllers");
const {
  mainAdminProtectRoute,
  ProtectRoute,
  ProtectStaffRoute,
} = require("../middlewears/auth-middlewear");
const {
  staffImageStorageMiddlewear,
} = require("../middlewears/staffImage-middlewear");

const routes = express.Router();

routes.post("/login", staffController.login);
routes.post("/register", staffController.register);
routes.get("/verify/:staffId/:uniqueString", staffController.verifyStaff);
routes.get("/", staffController.getAllStaffs);
routes.get("/:staffId", staffController.getSingleAllStaffs);
routes.put("/update/:staffId", staffController.updateStaff);
routes.put(
  "/edit-staff/:staffId",
  ProtectStaffRoute,
  staffImageStorageMiddlewear,
  staffController.editStaff
);

// routes.put(
//   "/update-single-admin/:id",
//   ProtectRoute,
//   adminController.editSingleAdmin
// );

module.exports = routes;
