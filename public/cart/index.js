// 상품 목록을 가져오는 함수 정의
const fetchProductList = async () => {
  try {
    const response = await fetch("/api/product", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("상품 목록을 가져오는 데 실패했습니다.");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetch 오류:", error);
    return [];
  }
};

// 상품 상세 페이지 로드 시
window.addEventListener("load", async () => {
  const token = localStorage.getItem("token");
  // token이 가져와졌는지 체크
  if (token === null) {
    // 오류 뜰 곳
    alert("(!)토큰이 존재하지 않음.");
    window.location.href = "/signin";
    return; // 페이지 이동 시 이후 코드 실행 방지
  }

  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productList = await fetchProductList(); // 상품 목록을 먼저 가져옵니다

    if (cart.length === 0) {
      throw new Error("장바구니에 상품이 없습니다.");
    }

    // 기존 상품 목록을 초기화
    const cartPage = document.getElementById("cart_detail");
    if (!cartPage) {
      throw new Error("cart_detail 요소가 존재하지 않습니다.");
    }
    cartPage.innerHTML = "";

    // 장바구니의 각 상품을 렌더링
    cart.forEach(({ productId, quantity }) => {
      const product = productList.find((item) => item.productId === productId);
      if (product) {
        renderProductDetail(product, quantity);
      } else {
        console.error(`Product Id ${productId} not found in product list`);
      }
    });
    await calculateTotal();
  } catch (error) {
    console.error("Fetch 오류:", error.message);
  }
});

// 상품 상세 정보 렌더링 함수
function renderProductDetail(product, quantity) {
  const cartPage = document.getElementById("cart_detail");

  // Create elements for product details
  const productDiv = document.createElement("div");
  productDiv.classList.add("cart-item");
  productDiv.classList.add(`product-${product.productId}`); // productId를 클래스에 추가

  productDiv.innerHTML = `
    <input type="checkbox" class="select-product" checked />
    <div class="product-image">
        <img src="${product.imgUrl}" data-product-id="${product.productId}" />
    </div>
    <div id="product">
      <div class="product_title">상품명: ${product.title}</div>
      <div class="product_price">가격: ${Number(
        product.price
      ).toLocaleString()}원</div>
      <input type="button" class="minus" value="-" />
      <span class="stock-value">${quantity}개</span>
      <input type="button" class="plus" value="+" />
    <button class="cart-delete">삭제</button></div>
  `;

  cartPage.appendChild(productDiv);

  // Attach event listeners for each button
  attachEventListeners(product.productId, product.stock);

  // Attach event listener to image
  const productImage = productDiv.querySelector(".product-image img");
  if (productImage) {
    productImage.addEventListener("click", () => {
      window.location.href = `/product/detail?id=${product.productId}`;
    });
  }
}

// 이벤트 리스너를 각 상품에 대해 추가
function attachEventListeners(productId, stock) {
  const cartPage = document.getElementById("cart_detail");
  const cartItem = cartPage.querySelector(`.product-${productId}`); // productId를 사용하여 cartItem 찾기

  if (cartItem) {
    const minusBtn = cartItem.querySelector(".minus");
    const plusBtn = cartItem.querySelector(".plus");
    const deleteBtn = cartItem.querySelector(".cart-delete");
    const stockValueElement = cartItem.querySelector(".stock-value");

    // 상품 수량 감소
    minusBtn.addEventListener("click", async () => {
      updateCartQuantity(productId, -1);
      stockValueElement.textContent = `${getProductQuantity(productId)}개`;
      await calculateTotal(); // 수량 변경 후 총합 계산 및 업데이트
    });

    // 상품 수량 증가
    plusBtn.addEventListener("click", async () => {
      const currentQuantity = getProductQuantity(productId);
      if (currentQuantity < stock) {
        updateCartQuantity(productId, 1);
        stockValueElement.textContent = `${getProductQuantity(productId)}개`;
        await calculateTotal(); // 수량 변경 후 총합 계산 및 업데이트
      } else {
        alert(`재고가 부족합니다. 최대 ${stock}개까지 추가할 수 있습니다.`);
      }
    });

    // 상품 삭제
    deleteBtn.addEventListener("click", async () => {
      removeProductFromCart(productId);
      cartItem.remove();
      await calculateTotal(); // 삭제 후 총합 계산 및 업데이트
    });
  } else {
    console.error(`Product Id ${productId} not found in cart items`);
  }
}

// 장바구니에서 상품의 수량 업데이트
function updateCartQuantity(productId, delta) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart.find((item) => item.productId === productId);

  if (product) {
    product.quantity += delta;
    if (product.quantity <= 0) {
      removeProductFromCart(productId); // 장바구니에서 삭제
      const cartItem = document.querySelector(`.product-${productId}`);
      if (cartItem) {
        cartItem.remove(); // 화면에서도 삭제
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
      const stockValueElement = document.querySelector(
        `.product-${productId} .stock-value`
      );
      if (stockValueElement) {
        stockValueElement.textContent = `${product.quantity}개`;
      }
    }
  }
}

// 장바구니에서 상품 삭제
function removeProductFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.productId !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 특정 상품의 수량 가져오기
function getProductQuantity(productId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart.find((item) => item.productId === productId);
  return product ? product.quantity : 0;
}

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

    // Update total price display if needed
    const totalPriceElement = document.getElementById("total_price");
    if (totalPriceElement) {
      totalPriceElement.textContent = `${Number(total).toLocaleString()}원`;
    } else {
      console.error("Total price element not found");
    }

    return total;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

// "쇼핑 계속하기" 버튼 추가 및 이벤트 리스너
const shop_buttonDiv = document.getElementById("shopping_button");
const addCartButton = document.createElement("button");
addCartButton.innerHTML = "쇼핑 계속하기";

addCartButton.addEventListener("click", () => {
  alert("쇼핑을 계속합니다.");
  window.location.href = "/product";
});

buttonDiv.appendChild(continueShoppingButton);

document.getElementById("mypage").addEventListener("click", () => {
  window.location.href = "/mypage";
});

document.getElementById("cart").addEventListener("click", () => {
  window.location.href = "/cart";
});

document.getElementById("service_name").addEventListener("click", () => {
  window.location.href = "/product";
});
