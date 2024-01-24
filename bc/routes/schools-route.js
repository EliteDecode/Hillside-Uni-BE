const express = require("express");
const schoolsController = require("../controllers/schools-controller");
const { ProtectRoute } = require("../middlewears/auth-middlewear");
const { imageStorageMiddlewear } = require("../middlewears/image-middlewear");

const routes = express.Router();

routes.post(
  "/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  schoolsController.addSchools
);

routes.get("/published-schools", schoolsController.getAllPublishedSchools);
routes.get("/unPublished-schools", schoolsController.getAllUnPublishedSchools);
routes.get("/:schoolsId", schoolsController.getSingleSchools);
routes.put(
  "/edit-schools/:schoolsId/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  schoolsController.editSingleSchools
);
routes.put(
  "/toggle-publish-state/:schoolsId/:adminId",
  ProtectRoute,
  schoolsController.togglePublishState
);
routes.delete(
  "/delete-schools/:schoolsId/:adminId",
  ProtectRoute,
  schoolsController.deleteSingleSchools
);

module.exports = routes;
