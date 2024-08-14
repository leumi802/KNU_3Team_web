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
            <div>${v.title}</div>
            <div>가격: ${v.price}원</div>
            <div>[상세설명] ${v.description}</div>
            <div>
                <img src="${v.imgUrl}" />
            </div>
            <div>재고수량: ${v.stock}(개)</div>
        `;
    productListWrapper.append(itemElem);
  });
};

renderProductList();

// 1) (프론트) 사용자가 [마이페이지] 버튼 혹은 직접 url을 입력해서 이동한다.
// http://localhost:8000/mypage

// 2), 3) user.controller.js 이용
// 2) (프론트 + 백)사용자가 페이지 접근 후,
// localStorage에 있는 token을 꺼내서
// 백엔드로 보내서, 해당 토큰의 유효성을 검증한다.

// 3) (백) 유효성 검증 결과에 따른 사용자 인증여부를
// 프론트로 반환한다.
// res.json({isVerify: true})

// 4) (프론트) 3)로 부터 받은 응답값을 통해서
// 토큰이 유효하다면 그대로 페이지 사용을 하게하고,
// 토큰이 유효하지 않다면 localhost:8000/signin 페이지로 보냄 res.json({isVerify: true}) ==> false일떄
// localStorage 에서 토큰 삭제 (localStorage.removeItem() 비스무리한거 삭제하면 됨.)

/**
 * localStorage.getItem()으로 token을
 * user가 토큰을 갖고 있으면
 * 토큰을 꺼내는거 => userController.get
 * 토큰을 검사해서 계
 *
 * 백엔드로 볼낼때는 fetch
 *
 */
