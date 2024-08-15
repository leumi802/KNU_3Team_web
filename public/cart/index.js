// id를 받아와서 해당 id의 상세정보 출력
// 상품 상세 페이지 렌더링
// id 받아오기
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartid = parseInt(cart.id); //해당 상품 id

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
    console.log(productData.data[0]);
    // 상품 데이터가 존재하는 경우 렌더링
    const proList = productData.data[cartid];

    if (proList && proList.productId === parseInt(cartid)) {
      renderProductDetail(proList, cart.stock);
      pluscount();
      minuscount();
      deleteCart();
      titleclick();
    } else {
      //상품의 코드가 없거나 2개 이상일때
      console.error("상품을 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("Fetch 오류:", error);
  }
});

// 상품 상세 정보 렌더링 함수
function renderProductDetail(product, count) {
  const ct = JSON.parse(localStorage.getItem("cart")) || [];

  const cartpage = document.getElementById("cart_detail");
  cartpage.innerHTML = `
    <div id="goto_detail${product.productId}">상품명: ${product.title}</div>
    <div>가격: ${product.price}원</div>
    <div><img src="${product.imgUrl}" /></div>
    <input type="button" id="minus" value="-"/>
    <span id="stock-value">${ct.stock}개</span>
    <input type="button" id="plus" value="+"/>
    <button id="cart_delete">삭제</button>
    `;
  console.log("상품을 정상적으로 업로딩했습니다.");
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
      JSON.stringify({ cart: minusdata.id, stock: --minusdata.stock })
    );
    stockValueElement.textContent = minusdata.stock + "개";
  });
}
function pluscount() {
  const pluscnt = document.getElementById("plus");
  const stockValueElement = document.getElementById("stock-value");

  pluscnt.addEventListener("click", () => {
    const plusdata = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem(
      "cart",
      JSON.stringify({ cart: plusdata.id, stock: ++plusdata.stock })
    );
    stockValueElement.textContent = plusdata.stock + "개";
  });
}
