const express = require("express");
const collegesController = require("../controllers/colleges-controller");
const { ProtectRoute } = require("../middlewears/auth-middlewear");
const { imageStorageMiddlewear } = require("../middlewears/image-middlewear");

const routes = express.Router();

routes.post(
  "/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  collegesController.addColleges
);

routes.get("/published-colleges", collegesController.getAllPublishedColleges);
routes.get(
  "/unPublished-colleges",
  collegesController.getAllUnPublishedColleges
);
routes.get("/:collegesId", collegesController.getSingleColleges);
routes.put(
  "/edit-colleges/:collegesId/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  collegesController.editSingleColleges
);
routes.put(
  "/toggle-publish-state/:collegesId/:adminId",
  ProtectRoute,
  collegesController.togglePublishState
);
routes.delete(
  "/delete-colleges/:collegesId/:adminId",
  ProtectRoute,
  collegesController.deleteSingleColleges
);

module.exports = routes;
