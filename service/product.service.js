const Product = require("../schema/product.schema");
const getProductList = async () => {
  // 'Product' 모델을 통해, MongoDB에서 데이터를 가져와야함.
  try {
    const productList = await Product.find();
    return productList;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getProductListById = async (productId) => {
  // 'Product' 모델을 통해, MongoDB에서 데이터를 가져와야함.
  try {
    const productList = await Product.findOne({ productId });
    return productList;
  } catch (err) {
    console.error(err);
    return {};
  }
};

module.exports = {
  getProductList,
  getProductListById,
};
