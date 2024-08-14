const productController = require("./product.controller");
const userController = require("./user.controller");
const apiController = require("express").Router();

apiController.use("/user", userController);
apiController.use("/product", productController);       // 이걸로 사용할 수 있음..? 어떻게 사용할수 있다는 거더라

module.exports = apiController;