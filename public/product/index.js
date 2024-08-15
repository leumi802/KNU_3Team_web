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

const productListWrapper = document.getElementById("product_list_wrapper");

const renderProductList = async () => {
  const productList = await fetchProductList();
  // productList [] | null
  if (!productList || productList.lenght === 0) {
    console.log("empty productList");
    return;
  }
  // productList 가 존재하는 경우.
  productList.forEach((v) => {
    const itemElem = document.createElement("div");
    itemElem.innerHTML = `
      <div id="product_wrapper">
        <div>
          <img id="goto_detail${v.productId}" src="${v.imgUrl}" />
        </div>
        <div id="product_title">${v.title}</div>
        <div id="product_description">${v.description}</div>
        <div id="product_price">가격: ${v.price}원</div>
        <div id="product_stock">재고수량: ${v.stock}(개)</div>
      </div>
    `;
    productListWrapper.append(itemElem);
    const goto = document.getElementById(`goto_detail${v.productId}`);
    goto.addEventListener("click", () => {
      window.location.href = `http://localhost:8000/product/detail?id=${v.productId}`;
    });
  });
};

renderProductList();

document.getElementById("mypage").addEventListener("click", () => {
  window.location.href = "http://localhost:8000/mypage";
});

document.getElementById("cart").addEventListener("click", () => {
  window.location.href = "http://localhost:8000/cart";
});
