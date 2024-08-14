const fetchProductList = async () => {
  const fetchResult = await fetch("/api/product", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (fetchResult.ok) {
    const fetchData = await fetchResult.json();
    // fetchData => { result: true, data: [] }
    console.log(fetchData);
    return fetchData.data;
  } else {
    return null;
  }
};

const productListWrapper = document.getElementById("product_list_wrapper");
const renderProductList = async () => {
  const productList = await fetchProductList();
  // productList [] || null
  if (!productList || productList.length === 0) {
    console.log("empty productList");
    return;
  }
  // productList가 존재하는 경우.
  productList.forEach((v) => {
    const itemElem = document.createElement("div"); // 실제로 만들어지지는 않는다.
    itemElem.innerHTML = `
    <div>${v.title}</div>
    <div>가격: ${v.price}원</div>
    <div>[상세설명] ${v.description}</div>
    <div>
        <img src="${v.imgUrl}"/>
    </div>
    <div>재고수량: ${v.stock}(개)</div>
    `;
    productListWrapper.append(itemElem);
  });
};

renderProductList();
