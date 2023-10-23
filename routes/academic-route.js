const express = require("express");
const academicsController = require("../controllers/academics-controller");
const { ProtectRoute } = require("../middlewears/auth-middlewear");
const { imageStorageMiddlewear } = require("../middlewears/image-middlewear");

const routes = express.Router();

routes.post("/:adminId", ProtectRoute, academicsController.addAcademics);

routes.get(
  "/published-academics",
  academicsController.getAllPublishedacademics
);
routes.get(
  "/unPublished-academics",
  academicsController.getAllUnPublishedacademics
);
routes.get("/:academicsId", academicsController.getSingleacademics);
routes.put(
  "/edit-academics/:academicsId/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  academicsController.editSingleacademics
);
routes.put(
  "/toggle-publish-state/:academicsId/:adminId",
  ProtectRoute,
  academicsController.togglePublishState
);
routes.delete(
  "/delete-academics/:academicsId/:adminId",
  ProtectRoute,
  academicsController.deleteSingleacademics
);

module.exports = routes;
