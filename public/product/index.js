const fetchProductList = async () => {
  // product.controller와의 통신을 통해 `product` 가져옴
  const fetchResult = await fetch("/api/product", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (fetchResult.ok) {
    const fetchData = await fetchResult.json();
    // fetchData = {result: true, data: []}
    console.log(fetchData);
    return fetchData.data;
  } else {
    return null;
  }
};

const productListWrapper = document.getElementById("product_list_wrapper");
const renderProductList = async () => {
  const productList = await fetchProductList();
  //productList = [] or null
  if (!productList || productList.length === 0) {
    console.log("empty productList");
    return;
  }
  // 여기부턴 productList가 존재하는 경우 (검사 끝)
  //
  productList.forEach((v) => {
    const itemElem = document.createElement("div");
    itemElem.innerHTML = `
        <div>${v.title}</div>
        <div>가격: ${v.price}원</div>
        <div>[상세설명] ${v.description}</div>
        <div>
            <img src="${v.imgUrl}"/>
        </div>
        <div>재고수량: ${v.stock}</div>
    `;
    productListWrapper.append(itemElem);
  });
};
renderProductList();

// (프론트)
// 1) 사용자가 [마이페이지]버튼 혹은
// 직접 url을 입력해서 이동한다
// http://localhost/mypage

// (프론트+백)
// 2) 사용자가 페이지 접근 후, (window.eventlis(load))
// localStorage에 있는 token을 꺼내서 (localStorage.getItem("token",.token);)
// 백엔드로 보내서(feach), 해당 토큰을 유효성을 검증한다. (verify)
//
// window.eventlisn 이벤트 접근 감지(load)
// local getitem 토큰 가져오기
// verify(tkn, process.env.JWT_SECRET) 유효성 검증
//

// (백)
// 3) 유효성 검증 결과에 따른 사용자 인증여부를
// 프론트로 반환한다.
// res.json({isVerify: true})

// (프론트)
// 4) 3번으로부터 받은 응답값을 통해서
// 토큰이 유효하다면 그대로 페이지 사용을 하게하고,
// 토큰이 유효하지않다면, localhost:8000/signin 페이지로 보냄
