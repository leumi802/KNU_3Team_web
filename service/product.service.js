const Product = require("../schema/product.schema");

const getProductList = () => {
  // 'Product' 모델을 통해, MongoDB에서 데이터를 가져와야 함.
  const productList = []; /* Product. */
  return productList;
};

module.exports = {
  getProductList,
};
