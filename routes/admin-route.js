const express = require("express");
const adminController = require("../controllers/admin-controllers");
const {
  mainAdminProtectRoute,
  ProtectRoute,
} = require("../middlewears/auth-middlewear");

const routes = express.Router();

routes.post("/login", adminController.login);
routes.post("/register", adminController.register);
routes.get(
  "/get-admins/:id",
  mainAdminProtectRoute,
  adminController.getAllAdminsByMain
);
routes.get(
  "/get-single-admin-main/:singleAdminId/:id",
  mainAdminProtectRoute,
  adminController.getSingleAdminByMain
);

routes.get(
  "/get-single-admin/:id",
  ProtectRoute,
  adminController.getSingleAdmin
);
routes.put(
  "/update-single-admin-main/:singleAdminId/:id",
  mainAdminProtectRoute,
  adminController.editSingleAdminByMain
);

routes.put(
  "/update-single-admin-password-main/:singleAdminId/:id",
  mainAdminProtectRoute,
  adminController.changePasswordByMain
);
routes.put(
  "/update-single-admin-password/:singleAdminId",
  ProtectRoute,
  adminController.changePassword
);

routes.put(
  "/update-single-admin/:id",
  ProtectRoute,
  adminController.editSingleAdmin
);

routes.delete(
  "/delete-single-admin/:singleAdminId/:id",
  mainAdminProtectRoute,
  adminController.deleteSingleAdmin
);
module.exports = routes;
