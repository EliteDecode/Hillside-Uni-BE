const express = require("express");
const subscriberController = require("../controllers/subscribers-controller");

const routes = express.Router();

routes.post("/", subscriberController.addSubscribers);

routes.get("/", subscriberController.getSubscribers);

routes.delete("/:subscriberId", subscriberController.deleteSubscriber);

module.exports = routes;
