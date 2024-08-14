const productController = require("./product.controller");
const userController = require("./user.controller");
const apiController = require("express").Router();

apiController.use("/user", userController);
apiController.use("/product", productController);

module.exports = apiController;
