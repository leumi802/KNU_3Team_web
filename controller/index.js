const apiController = require("express").Router();
const productController = require("./product.controller");
const userController = require("./user.controller");

apiController.use("/user", userController);
apiController.use("/product", productController);

module.exports = apiController;
