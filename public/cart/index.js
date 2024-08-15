// id를 받아와서 해당 id의 상세정보 출력
// 상품 상세 페이지 렌더링
// id 받아오기
const cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log(cart);
window.addEventListener("load", async () => {
  try {
    // 백엔드로 상품 상세 데이터 요청
    const verifyResult = await fetch(`/api/product`, {
      method: "get", // GET 요청
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 응답 결과 확인
    if (!verifyResult.ok) {
      throw new Error("네트워크 응답이 좋지 않습니다.");
    }

    // json 형식으로 데이터 저장
    const productData = await verifyResult.json();
    // 상품 데이터가 존재하는 경우 렌더링
    let cnt = 0;
    cart.forEach(async (product, quantity) => {
      const proList = productData.data[product.productId];

      if (proList && proList.productId === cart[cnt].productId) {
        renderProductDetail(proList, quantity);
        pluscount(cnt);
        //minuscount();
        //deleteCart();
        //await moveProductDetail();
        //await calculateTotal();
      } else {
        console.error("상품을 찾을 수 없습니다.");
      }
      cnt++;
    });
  } catch (error) {
    console.error("Fetch 오류:", error);
  }
});

// 상품 상세 정보 렌더링 함수
function renderProductDetail(product, quantity) {
  const ct = JSON.parse(localStorage.getItem("cart")) || [];

  const cartpage = document.getElementById("cart_detail");

  const item = document.createElement("div");
  item.classList.add("cart-item");

  item.innerHTML = `
    <div id="goto_detail${product.productId}">상품명: ${product.title}</div>
    <div>가격: ${product.price}원</div>
    <div><img src="${product.imgUrl}" /></div>
    <input type="button" id="minus" value="-"/>
    <span id="stock-value">${ct.stock}개</span>
    <input type="button" id="plus" value="+"/>
    <button id="cart_delete">삭제</button>
    <div id="total_price">총금액:</div><br>
    `;
  console.log("상품을 정상적으로 업로딩했습니다.");
  cartpage.appendChild(item);
}

function titleclick() {
  const title = document.getElementById(`goto_detail${cartid}`);
  console.log(cart);
  if (title) {
    title.addEventListener("click", () => {
      window.location.href = `http://localhost:8000/product/detail?id=${cartid}`;
    });
  } else {
    console.error(`Product Id ${productId} not found`);
  }
}
// 상품 상세 페이지 이동 함수
// const moveProductDetail = () => {
//   const cart = JSON.parse(localStorage.getItem("cart")) || [];

//   cart.forEach(({ productId }) => {
//     const goToProduct = document.getElementById(`goto_detail${productId}`);

//     if (goToProduct) {
//       goToProduct.addEventListener("click", () => {
//         window.location.href = `http://localhost:8000/product/detail?id=${productId}`;
//       });
//     } else {
//       console.error(`Product Id ${productId} not found`);
//     }
//   });
// };

function deleteCart() {
  const deleteCart = document.getElementById("cart_delete");
  deleteCart.addEventListener("click", () => {
    const cartpage = document.getElementById("cart_detail");
    cartpage.innerHTML = "";
    localStorage.removeItem("cart");
    alert("해당 물품이 삭제되었습니다.");
  });
}

function minuscount() {
  const minuscnt = document.getElementById("minus");
  const stockValueElement = document.getElementById("stock-value");

  minuscnt.addEventListener("click", () => {
    const minusdata = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem(
      "cart",
      JSON.stringify({ cart: minusdata.id, quantity: --minusdata.quantity })
    );
    stockValueElement.textContent = minusdata.quantity + "개";
  });
}
function pluscount(cnt) {
  const pluscnt = document.getElementById("plus");
  const stockValueElement = document.getElementById("stock-value");

  pluscnt.addEventListener("click", () => {
    const plusdata = JSON.parse(localStorage.getItem("cart")) || [];
    console.log(plusdata[cnt]);
    plusdata[cnt] = {
      productId: plusdata[cnt].productId,
      quantity: ++plusdata[cnt].quantity,
    };
    localStorage.setItem("cart", JSON.stringify(plusdata));
    stockValueElement.textContent = plusdata[cnt].quantity + "개";
  });
}

const fetchProductList = async () => {
  // product.controller와의 통신을 통해 'product' 데이터를 가져옴
  const fetchResult = await fetch("/api/product", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (fetchResult.ok) {
    const fetchData = await fetchResult.json();
    // fetchData = {return ???}
    console.log(fetchData);
    return fetchData.data;
  } else {
    return null;
  }
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
