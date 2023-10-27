const express = require("express");
const departmentController = require("../controllers/department-controller");
const { ProtectRoute } = require("../middlewears/auth-middlewear");
const { imageStorageMiddlewear } = require("../middlewears/image-middlewear");

const routes = express.Router();

routes.post(
  "/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  departmentController.addDepartment
);

routes.get(
  "/published-department",
  departmentController.getAllPublishedDepartment
);
routes.get(
  "/unPublished-department",
  departmentController.getAllUnPublishedDepartment
);
routes.get("/:departmentId", departmentController.getSingleDepartment);
routes.put(
  "/edit-department/:departmentId/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  departmentController.editSingleDepartment
);
routes.put(
  "/toggle-publish-state/:departmentId/:adminId",
  ProtectRoute,
  departmentController.togglePublishState
);
routes.delete(
  "/delete-department/:departmentId/:adminId",
  ProtectRoute,
  departmentController.deleteSingleDepartment
);

module.exports = routes;
