const express = require("express");
const galleryController = require("../controllers/gallery-controller");
const { ProtectRoute } = require("../middlewears/auth-middlewear");
const { imageStorageMiddlewear } = require("../middlewears/image-middlewear");

const routes = express.Router();

routes.post(
  "/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  galleryController.addgallery
);

routes.get("/published-gallery", galleryController.getAllPublishedgallery);
routes.get("/unPublished-gallery", galleryController.getAllUnPublishedgallery);
routes.get("/:galleryId", galleryController.getSinglegallery);
routes.put(
  "/edit-gallery/:galleryId/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  galleryController.editSinglegallery
);
routes.put(
  "/toggle-publish-state/:galleryId/:adminId",
  ProtectRoute,
  galleryController.togglePublishState
);
routes.delete(
  "/delete-gallery/:galleryId/:adminId",
  ProtectRoute,
  galleryController.deleteSinglegallery
);

module.exports = routes;
