const productController = require("express").Router();

const dummydata = Array.from({ length: 30 }, (_, index) => {
  const product = {
    title: `product-title-${index + 1}`,
    price: Math.floor(Math.random() * 90000) + 10000, //10,000 ~ 100,000
    description: `product-description -${index + 1}`,
    imgUrl: `https://picsum.photos/id/${index + 1}/200/300`,
    stock: Math.ceil(Math.random() * 100), // 0 ~ 100
  };
  return product;
});

// 상품 조회 API
// 목표 1. 전체 싹다 뽑기
// 목표 2. 필터(조건) 적용
// 목표 3. 페이지네이션 적용
productController.get("/", (req, res) => {
  return res.json({ result: true, data: dummydata });
});

module.exports = productController;
