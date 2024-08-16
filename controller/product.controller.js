const {
  getProductList,
  getProductListById,
  updateProductQuantity,
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
    const product = await getProductListById(productId);
    // console.log("productController.post: product:", product);

    return res.status(200).json({
      result: true,
      data: product,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      result: false,
      message: "(!)상품 목록 가져오기 실패",
    });
  }
});

// 사용자가 주문 or 주문 취소시, db의 재고 수정.
productController.patch("/", async (req, res) => {
  const { productId, productQuantity } = req.body;

  console.log(productId, productQuantity);
  try {
    // id로 db의 product 가져오기
    const product = await getProductListById(productId);
    // console.log("productController.post: productId:", product.productId);
    // console.log("productController.post: productId:", product.stock);
    updateProductQuantity(product.productId, product.stock + productQuantity);
    return res.status(200).json({
      result: true,
      productId: productId,
      message: "재고 수량 변경 성공",
    });
  } catch (err) {
    console.errer(err);
    return res.status(500).json({
      result: false,
      productId: productId,
      message: "(!)재고 수량 변경 실패",
    });
  }
});

module.exports = productController;
