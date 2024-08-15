// 상품 상세 페이지 이동 함수
const moveProductDetail = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.forEach(({ productId }) => {
    const goToProduct = document.getElementById(`goto_detail${productId}`);

    if (goToProduct) {
      goToProduct.addEventListener("click", () => {
        window.location.href = `http://localhost:8000/product/detail?id=${productId}`;
      });
    } else {
      console.error(`Product Id ${productId} not found`);
    }
  });
};

// 장바구니 상품 금액 합계를 계산하는 함수
const calculateTotal = async () => {
  try {
    const productList = await fetchProductList();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cart.forEach(({ productId, quantity }) => {
      const product = productList.find((v) => v.productId === productId);
      if (product) {
        total += product.price * quantity;
      } else {
        console.error(`Product Id ${productId} not found`);
      }
    });

    document.getElementById("total_price").textContent = total;
    return total;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

window.addEventListener("load", async () => {
  await moveProductDetail();
  await calculateTotal();
});
