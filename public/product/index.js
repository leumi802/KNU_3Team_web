const fetchProductList = async () => {
  // 1. product.controller와의 통신을 통해 'product' 가져오기
  const fetchResult = await fetch("/api/product", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (fetchResult.ok) {
    const fetchData = await fetchResult.json();
    // fetchData => {result:true, data:[]}
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
  if (!productList || productList.length === 0) {
    console.log("empty productList");
    return;
  }
  // productList가 존재하는 경우
  productList.forEach((value) => {
    const itemElem = document.createElement("div");
    itemElem.innerHTML = `
      <div class="product">
      <div>${value.title}</div>
      <div>가격 : ${value.price}원</div>
      <div>[상세설명] ${value.description}</div>
      <div>
        <img src="${value.imgUrl}" />
      </div>
      <div>재고수량 : ${value.stock}개</div>
      </div><hr>
    `;
    productListWrapper.append(itemElem);
  });
};

renderProductList();
