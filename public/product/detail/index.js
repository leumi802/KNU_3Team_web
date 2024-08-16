// 상품 상세 페이지 렌더링
window.addEventListener("load", async () => {
  // 특정 상품 id 추출
  const pathname = window.location.href;
  const id = pathname.split("detail/?id=")[1];
  // console.log('id', id);

  try {
    // 백엔드로 상품 상세 데이터 요청
    const verifyResult = await fetch(`/api/product`, {
      method: "post",
      body: JSON.stringify({ productId: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 응답 결과 확인
    if (verifyResult.ok) {
      const productData = await verifyResult.json();

      const fetchData = productData.data[0];
      renderProductDetail(fetchData);
      addFunc(fetchData);
      console.log("상품을 정상적으로 업로딩했습니다.");
    } else {
      console.log("상품 정보가 없습니다.");
    }
  } catch (error) {
    console.error("Fetch 오류:", error);
  }
});

// 상품 상세 정보 렌더링 함수
function renderProductDetail(product) {
  const productDetail = document.getElementById("product_detail");
  productDetail.innerHTML = `
<div id="img_container">
    <img src="${product.imgUrl}" />
</div>
<div id="product_info">
    <div id="product_title">${product.title}</div>
    <div id="product_description">${product.description}</div>
    <div id="product_price">가격: ${Number(
      product.price
    ).toLocaleString()}원</div>
    <div id="product_stock">재고수량: ${product.stock}(개)</div>
    <div id="input">
      <p>수량: </p>
      <input id="quantity" type="number" min=1 max=${[
        product.stock,
      ]} value="1"/></div>
    <div id="product_btn">
      <button id="put">담기</button>
      <button id="goto_order">결제하기</button>
    </div>
</div>
`;
}

// html에 함수 추가
const addFunc = (product) => {
  document.getElementById("put").addEventListener("click", () => {
    updateLocalCart(product);
  });

  document.getElementById("goto_order").addEventListener("click", async () => {
    updateLocalCart(product);
    window.location.href = "/cart";
  });

  document.getElementById("mypage").addEventListener("click", () => {
    window.location.href = "/mypage";
  });

  document.getElementById("cart").addEventListener("click", () => {
    window.location.href = "/cart";
  });

  document.getElementById("service_name").addEventListener("click", () => {
    window.location.href = "/product";
  });
};

// localStorage의 cart를 업데이트 하는 함수
const updateLocalCart = (product) => {
  const quantity = parseInt(document.getElementById("quantity").value); // 입력된 수량 가져오기
  if (quantity > product.stock) {
    alert("재고 수량보다 많은 수량을 선택할 수 없습니다.");
    return;
  } else if (quantity < 1) {
    alert("1개 미만의 재품을 담을 수 없습니다.");
  } else {
    // localStorage에 저장할 객체 생성
    const cartItem = {
      productId: product.productId,
      quantity: quantity, // 재고 수량
    };

    // 기존 장바구니 항목 가져오기, 장바구니가 없으면 빈 배열로 초기화
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart) {
      cart = [];
    }

    // 장바구니에 상품 추가 또는 수량 업데이트
    const existingItemIndex = cart.findIndex(
      (item) => item.productId === product.productId
    );
    if (existingItemIndex > -1) {
      // 이미 장바구니에 있는 상품의 경우 수량 업데이트
      if (cart[existingItemIndex].quantity + quantity <= product.stock) {
        cart[existingItemIndex].quantity += quantity;
        // 조건 통과시 장바구니에 담기
        alert("장바구니에 담겼습니다.");
      } else {
        alert("재고가 부족합니다.");
      }

      //if (cart[existingItemIndex].quantity <= prooduct.stock){
      //   cart[existingItemIndex].quantity += quantity;
      //}
    } else {
      // 장바구니에 없는 상품인 경우 새로 추가
      cart.push(cartItem);
      // 조건 통과시 장바구니에 담기
      alert("장바구니에 담겼습니다.");
    }

    // 업데이트된 장바구니를 localStorage에 저장
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};
