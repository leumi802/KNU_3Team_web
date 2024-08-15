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
const buttonDiv = document.getElementById("button"); // 버튼을 추가할 div 요소 선택
const addCartButton = document.createElement("button"); // 상품 추가 버튼 생성
addCartButton.innerHTML = "쇼핑 계속하기";

// 버튼 클릭 이벤트 리스너 추가
addCartButton.addEventListener("click", () => {
  // 다른 페이지로 넘어갈때 토큰 검증해주는 함수

  alert("쇼핑을 계속합니다.");
  window.location.href = "/product";
});

// 생성한 버튼을 buttonDiv에 추가
buttonDiv.appendChild(addCartButton);
