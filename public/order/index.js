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
    return data.data;
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

window.addEventListener("load", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("(!)토큰이 존재하지 않음.");
    window.location.href = "/signin";
    return;
  }

  try {
    const orderInfo = JSON.parse(localStorage.getItem("orderInfo")) || [];
    const productList = await fetchProductList();

    if (orderInfo.length === 0) {
      alert("결제할 상품이 없습니다.");
      window.location.href = "/cart";
      throw new Error("결제할 상품이 없습니다.");
    }

    for (const { productId, quantity } of orderInfo) {
      const product = productList.find((item) => item.productId === productId);
      if (product) {
        const total = await calculateTotalForProduct(
          productId,
          productList,
          orderInfo
        );
        renderProductDetail(product, quantity, total);
      } else {
        console.error(`(!)ProductId ${productId}가 없습니다.`);
      }
    }

    await calculateTotal(); // 총합 계산
  } catch (error) {
    console.error(error.message);
  }
});

function renderProductDetail(product, quantity, total) {
  const orderProduct = document.getElementById("product_to_pay");
  if (!orderProduct) {
    throw new Error("(!)product_to_pay 요소가 존재하지 않습니다.");
  }

  const productDiv = document.createElement("div");

  productDiv.innerHTML = `
      <div class="product-title">상품명: ${product.title}</div>
      <div class="product-price">가격: ${product.price.toLocaleString()}원</div>
      <span class="stock-value">${quantity}개</span>
      <div id="product-total-price">${
        product.title
      } 총 가격: ${total.toLocaleString()}원</div>
    `;
  orderProduct.appendChild(productDiv);
}

const calculateTotalForProduct = async (productId, productList, orderInfo) => {
  try {
    const orderItem = orderInfo.find((item) => item.productId === productId);
    if (!orderItem) {
      console.error(`ProductId ${productId}가 선택되지 않았습니다.`);
      return 0;
    }

    const product = productList.find((v) => v.productId === productId);
    if (!product) {
      console.error(`ProductId ${productId}를 찾을 수 없습니다.`);
      return 0;
    }

    return product.price * orderItem.quantity;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const calculateTotal = async () => {
  try {
    const productList = await fetchProductList();
    const orderInfo = JSON.parse(localStorage.getItem("orderInfo")) || [];
    let total = 0;

    orderInfo.forEach(({ productId, quantity }) => {
      const product = productList.find((v) => v.productId === productId);
      if (product) {
        total += product.price * quantity;
      }
    });

    const totalPriceElement = document.getElementById("total_price");
    if (totalPriceElement) {
      totalPriceElement.textContent = `총 합계 : ${total.toLocaleString()}원`;
    } else {
      console.error("가격을 표시할 요소가 없습니다.");
    }
  } catch (err) {
    console.error(err);
    return 0;
  }
};
