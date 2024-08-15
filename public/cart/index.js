// 상품 목록을 가져오는 함수 정의
const fetchProductList = async () => {
  try {
    const response = await fetch("/api/product", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("상품 목록을 가져오는 데 실패했습니다.");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

window.addEventListener("load", async () => {
  const token = localStorage.getItem("token");
  // token이 가져와졌는지 체크
  if (!token) {
    alert("(!)토큰이 존재하지 않음.");
    window.location.href = "/signin";
    return; // 페이지 이동 시 이후 코드 실행 방지
  }

  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productList = await fetchProductList();

    if (cart.length === 0) {
      alert("장바구니에 상품이 없습니다.");
      window.location.href = "/product";
      return;
    }

    // 장바구니의 각 상품을 렌더링
    cart.forEach(({ productId, quantity }) => {
      const product = productList.find((item) => item.productId === productId);
      if (product) {
        renderProductDetail(product, quantity);
      } else {
        console.error(`(!)ProductId ${productId}가 없습니다.`);
      }
    });

    await calculateTotal(); // 총합 계산
  } catch (error) {
    console.error(error.message);
  }
});

// 상품 상세 정보 렌더링 함수
function renderProductDetail(product, quantity) {
  const cartPage = document.getElementById("cart_detail");
  if (!cartPage) {
    console.error("(!)cart_detail 요소가 존재하지 않습니다.");
    return;
  }

  const productDiv = document.createElement("div");
  productDiv.classList.add("cart-item", `product-${product.productId}`);

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

  attachEventListeners(product.productId, product.stock);

  const productImage = productDiv.querySelector(".product-image img");
  if (productImage) {
    productImage.addEventListener("click", () => {
      window.location.href = `/product/detail?id=${product.productId}`;
    });
  }

  // 체크박스 상태 변화 감지
  const checkbox = productDiv.querySelector(".select-product");
  if (checkbox) {
    checkbox.addEventListener("change", async () => {
      await calculateTotal(); // 체크박스 상태 변경 시 총합 재계산
    });
  }
}

// 이벤트 리스너를 각 상품에 대해 추가
function attachEventListeners(productId, stock) {
  const cartPage = document.getElementById("cart_detail");
  const cartItem = cartPage.querySelector(`.product-${productId}`);

  if (cartItem) {
    const minusBtn = cartItem.querySelector(".minus");
    const plusBtn = cartItem.querySelector(".plus");
    const deleteBtn = cartItem.querySelector(".cart-delete");
    const stockValueElement = cartItem.querySelector(".stock-value");

    // 상품 수량 감소
    minusBtn.addEventListener("click", async () => {
      const currentQuantity = getProductQuantity(productId);
      if (currentQuantity <= 1) {
        alert("(!)최소 1개 이상이어야 합니다.");
        updateCartQuantity(productId, 1 - currentQuantity); // 1로 설정
      } else {
        updateCartQuantity(productId, -1);
      }
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
        alert(`최대 ${stock}개까지 추가할 수 있습니다.`);
      }
    });

    // 상품 삭제
    deleteBtn.addEventListener("click", async () => {
      removeProductFromCart(productId);
      cartItem.remove();
      await calculateTotal(); // 삭제 후 총합 계산 및 업데이트
    });
  } else {
    console.error(`(!)ProductId ${productId}가 없습니다.`);
  }
}

// 장바구니에서 상품의 수량 업데이트
function updateCartQuantity(productId, delta) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart.find((item) => item.productId === productId);

  if (product) {
    product.quantity += delta;
    if (product.quantity <= 0) {
      product.quantity = 1; // 수량을 1로 설정
      alert("최소 1개 이상이어야 합니다.");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    const stockValueElement = document.querySelector(
      `.product-${productId} .stock-value`
    );
    if (stockValueElement) {
      stockValueElement.textContent = `${product.quantity}개`;
    }
  }
}

// 장바구니에 상품 추가
function addProductToCart(productId, quantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find((item) => item.productId === productId);

  if (existingProduct) {
    existingProduct.quantity = quantity;
  } else {
    cart.push({ productId, quantity });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
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
      const isSelected = document.querySelector(
        `.product-${productId} .select-product`
      )?.checked;
      if (product && isSelected) {
        total += product.price * quantity;
      }
    });

    const totalPriceElement = document.getElementById("total_price");
    if (totalPriceElement) {
      totalPriceElement.textContent = `${Number(total).toLocaleString()}원`;
    } else {
      console.error("가격을 표시할 요소가 없습니다.");
    }
  } catch (err) {
    console.error(err);
  }
};

// 체크된 상품 정보를 localStorage에 저장하는 함수
const saveOrderInfo = async () => {
  try {
    const productList = await fetchProductList();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const orderInfo = cart
      .map(({ productId, quantity }) => {
        const product = productList.find((v) => v.productId === productId);
        const isSelected = document.querySelector(
          `.product-${productId} .select-product`
        )?.checked;

        if (product && isSelected) {
          return {
            productId: product.productId,
            quantity: quantity, // 장바구니에서의 수량
          };
        }
        return null;
      })
      .filter((item) => item !== null); // null 값 제거

    localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
  } catch (err) {
    console.error(err);
  }
};

// 결제하기 버튼 추가 및 이벤트 리스너 설정
const checkoutButton = document.getElementById("pay_button");
if (checkoutButton) {
  checkoutButton.addEventListener("click", async () => {
    await saveOrderInfo(); // 체크된 상품 정보를 localStorage에 저장
    window.location.href = "/order"; // 결제 페이지로 이동
  });
} else {
  console.error("결제하기 버튼이 없습니다.");
}

// "쇼핑 계속하기" 버튼 추가 및 이벤트 리스너
const buttonDiv = document.getElementById("button");
if (buttonDiv) {
  const continueShoppingButton = document.createElement("button");
  continueShoppingButton.innerHTML = "쇼핑 계속하기";

  continueShoppingButton.addEventListener("click", () => {
    alert("쇼핑을 계속합니다.");
    window.location.href = "/product";
  });
}

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
