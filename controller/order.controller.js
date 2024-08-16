const orderController = require("express").Router();
const { createOrder, getOrderList } = require("../service/order.service");

orderController.post("/", async (req, res) => {
  const {
    buyerId,
    buyerName,
    buyerEmail,
    buyerPhoneNum,
    recipientName,
    recipientAddress,
    recipientPhoneNum,
    products,
    recipientreqst,
  } = req.body;
  console.log(req.body);

  const user = {
    buyerId,
    buyerName,
    buyerEmail,
    buyerPhoneNum,
    recipientName,
    recipientAddress,
    recipientPhoneNum,
    products,
    recipientreqst,
  };
  try {
    await createOrder(user);
    return res.status(201).json({ result: true });
  } catch (err) {
    return res.status(500).json({ result: false });
  }
});

// 조회 api
// 1) 전체 싹다 뽑는다.
// 2) 필터(조건)를 적용한다.
// 3) 페이지네이션 적용(끊어서 보내주는 역할..?)

orderController.get("/", async (req, res) => {
  // 상품 전체 조회
  // 가져온 데이터를 res.json({})에 실어서 클라이언트로 보내준다.
  try {
    const orderlist = await getOrderList();
    return res.status(200).json({
      result: true,
      data: orderlist,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      result: false,
      message: "(!)구매자 목록 가져오기 실패",
    });
  }
});

// 바깥에서 참조할 수 있게끔 해줌
module.exports = orderController;
