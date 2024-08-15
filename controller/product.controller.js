const { getProductList } = require("../service/product.service");

const { getProductList } = require("../service/product.service");

const productController = require("express").Router();
/*
const dummyData = Array.from({ length: 30 }, (_, index) => {
    const product = {                                   // 이것들을 클라이언트 쪽으로 뿌려주는거임
        
        title: `product-title-${index + 1}`,
        price: Math.floor(Math.random() * 90000) + 10000,   // 10000 ~ 90000 
        description: `product-description-${index + 1}`,
        imgUrl: `https://picsum.photos/id/${index + 1}/200/300`,
        stock: Math.ceil(Math.random() * 100),              // 0 ~ 100
    }
    return product;
});

*/
// 상품 조회 api
// 1) 전체 싹다 뽑는다.
// 2) 필터(조건)를 적용한다.
// 3) 페이지네이션 적용(끊어서 보내주는 역할..?)

productController.get("/", async (req, res) => {
  // 상품 전체 조회
  // 가져온 데이터를 res.json({})에 실어서 클라이언트로 보내준다.
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


// 바깥에서 참조할 수 있게끔 해줌
module.exports = productController;
