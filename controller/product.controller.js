const productController = require("express").Router();

const dummyData = Array.from({ length: 30 }, (_, index) => {
  const product = {
    _id: index, // 이것들을 클라이언트 쪽으로 뿌려주는거임
    title: `product-title-${index + 1}`,
    price: Math.floor(Math.random() * 90000) + 10000, // 10000 ~ 90000
    description: `product-description-${index + 1}`,
    imgUrl: `https://picsum.photos/id/${index + 1}/200/300`,
    stack: Math.ceil(Math.random() * 100), // 0 ~ 100
  };
  return product;
});
// 상품 조회 api
// 1) 전체 싹다 뽑는다.
// 2) 필터(조건)를 적용한다.
// 3) 페이지네이션 적용(끊어서 보내주는 역할..?)

productController.get("/", (req, res) => {
  return res.json({ result: true, data: dummyData });
});

// 바깥에서 참조할 수 있게끔 해줌
module.exports = productController;
