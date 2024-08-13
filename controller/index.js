const userController = require("./user.controller");
const apiController = require("express").Router();

apiController.use("/user", userController);

module.exports = apiController;