const {
  getProductList,
  getProductListById,
} = require("../service/product.service");
const productController = require("express").Router();

// 상품 조회 api
// 1) 전체 싹다 뽑는다.
// 2) 필터(조건)를 적용한다.
// 3) 페이지네이션 적용(끊어서 보내주는 역할..?)

productController.get("/", async (req, res) => {
  // 상품 전체 조회
  try {
    const productList = await getProductList();
    return res.status(200).json({
      result: true,
      data: productList,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      result: false,
      message: "(!)상품 목록 가져오기 실패",
    });
  }
});

productController.post("/", async (req, res) => {
  const { productId } = req.body;
  // 상품 전체 조회
  try {
    const productList = await getProductListById(productId);
    console.log("productController.post: productList:", productList);
    return res.status(200).json({
      result: true,
      data: productList,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      result: false,
      message: "(!)상품 목록 가져오기 실패",
    });
  }
});
module.exports = productController;
