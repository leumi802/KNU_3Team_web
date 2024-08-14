const productController = require("express").Router();

// 상품 조회 api
// 1) 전체 싹다 뽑는다.
// 2) 필터(조건)를 적용한다.
// 3) 페이지네이션 적용(끊어서 보내주는 역할..?)

productController.get("/", (req, res) => {
  return res.json({ result: true, data: {} });
});

// 바깥에서 참조할 수 있게끔 해줌
module.exports = productController;
