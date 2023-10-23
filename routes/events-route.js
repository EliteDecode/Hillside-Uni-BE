const express = require("express");
const eventsController = require("../controllers/events-controller");
const { ProtectRoute } = require("../middlewears/auth-middlewear");
const { imageStorageMiddlewear } = require("../middlewears/image-middlewear");

const routes = express.Router();

routes.post(
  "/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  eventsController.addevents
);

routes.get("/published-events", eventsController.getAllPublishedevents);
routes.get("/unPublished-events", eventsController.getAllUnPublishedevents);
routes.get("/:eventsId", eventsController.getSingleevents);
routes.put(
  "/edit-events/:eventsId/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  eventsController.editSingleevents
);
routes.put(
  "/toggle-publish-state/:eventsId/:adminId",
  ProtectRoute,
  eventsController.togglePublishState
);
routes.delete(
  "/delete-events/:eventsId/:adminId",
  ProtectRoute,
  eventsController.deleteSingleevents
);

module.exports = routes;
