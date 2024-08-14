const productController = require("express").Router();

const dummyData = Array.from({ length: 30 }, (_, index) => {
  const product = {
    title: `product-title-${index + 1}`,
    price: Math.floor(Math.random() * 90000) + 10000, // 10,000 ~ 100,000
    description: `product-description-${index + 1}`,
    imgUrl: `https://picsum.photos/id/${index + 1}/200/300`,
    stock: Math.ceil(Math.random() * 100), // 0 ~ 100
  };
  return product;
});
// 상품조회 api
// 1) 전체 상품 모두 뽑기
// 2) 필터(조건)를 적용
// 3) 페이지네이션 적용
productController.get("/", async (req, res) => {
  return res.json({
    result: true,
    data: dummyData,
  });
});

module.exports = productController;
