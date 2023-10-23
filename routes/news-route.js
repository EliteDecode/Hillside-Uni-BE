const express = require("express");
const newsController = require("../controllers/news-controller");
const { ProtectRoute } = require("../middlewears/auth-middlewear");
const { imageStorageMiddlewear } = require("../middlewears/image-middlewear");

const routes = express.Router();

routes.post(
  "/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  newsController.addNews
);

routes.get("/published-news", newsController.getAllPublishedNews);
routes.get("/unPublished-news", newsController.getAllUnPublishedNews);
routes.get("/:newsId", newsController.getSingleNews);
routes.put(
  "/edit-news/:newsId/:adminId",
  ProtectRoute,
  imageStorageMiddlewear,
  newsController.editSingleNews
);
routes.put(
  "/toggle-publish-state/:newsId/:adminId",
  ProtectRoute,
  newsController.togglePublishState
);
routes.delete(
  "/delete-news/:newsId/:adminId",
  ProtectRoute,
  newsController.deleteSingleNews
);

module.exports = routes;
