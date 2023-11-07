const express = require("express");
const messageController = require("../controllers/message-controller");
const routes = express.Router();

routes.post("/", messageController.sendMessageToAdmin);

module.exports = routes;
