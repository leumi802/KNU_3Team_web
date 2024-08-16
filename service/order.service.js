const Order = require("../schema/order.schema");
const Product = require("../schema/product.schema");
const { getProductListById } = require("./product.service");

// Controller에서 호출
// user = { email: "", nickname: "", password: "" }
const createOrder = async (order) => {
  // Express <---> DB - 무슨 에러가 날지 알 수 없음.
  try {
    const createdOrder = await Order.create(order); // mongoDB에 접근. DB 접근하는 작업은 Service에서만.
    // console.log("createOrder:", createdOrder);
    // console.log("createOrder, producs:", createdOrder.products);

    createdOrder.products.map(async (product) => {
      const productStock = await getProductListById(product.productId);
      // console.log("productStock:", productStock.stock);
      // console.log("product.quantity: ", product.quantity);
      const productQuantity =
        Number(productStock.stock) - Number(product.quantity);
      // console.log(productQuantity);
      await Product.updateOne(
        { productId: product.productId },
        { $set: { stock: productQuantity } }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

const getOrderList = async () => {
  // 'order' 모델을 통해, MongoDB에서 데이터를 가져와야함.
  try {
    const orderList = await Order.find();
    return orderList;
  } catch (err) {
    console.error(err);
    return [];
  }
};

module.exports = {
  createOrder,
  getOrderList,
};
