// 상품 상세 페이지 렌더링
window.addEventListener("load", async () => {
    // 특정 상품 id 추출
    const pathname = window.location.href;
    const id = pathname.split("detail/?id=")[1];
    // console.log('id', id);

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
        const proList = productData.data[id];
        console.log(proList);
        if (productData && proList.productId === parseInt(id)) {
            renderProductDetail(proList);
        } else {
            //상품의 코드가 없거나 2개 이상일때
            console.error("상품을 찾을 수 없습니다.");
        }
    } catch (error) {
        console.error("Fetch 오류:", error);
    }
});

// 상품 상세 정보 렌더링 함수
function renderProductDetail(product) {
    const productListWrapper = document.getElementById("product-detail");
    const item = document.createElement("div");
    item.innerHTML = `
        <div> ${product.title}</div>
            <div>가격: ${product.price}원</div>
            <div>[상세설명] ${product.description}</div>
            <div>
                <img src="${product.imgUrl}" />
            </div>
            <div>재고수량: ${product.stock}(개)</div>
    `;

    // 수량 입력 필드 추가 
    // input은 1 ~ 재고까지밖에 수정하지 못함
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = 1; // 최소 수량 1
    quantityInput.max = product.stock; // 최대 수량은 재고 수량
    quantityInput.value = 1; // 기본값 1
    item.appendChild(quantityInput);


    const addCartButton = document.createElement('button');
    addCartButton.innerHTML = '장바구니';
    addCartButton.addEventListener("click", () => {
        const quantity = parseInt(quantityInput.value); // 입력된 수량 가져오기
        if (quantity > product.stock) {
            alert("재고 수량보다 많은 수량을 선택할 수 없습니다.");
            return;
        } else if (quantity < 0) {
            alert("1개 미만의 재품을 담을 수 없습니다.");
        }
        alert("장바구니에 담겼습니다.");


        // localStorage에 저장할 객체 생성
        const cartItem = {
            productId: product.productId,
            quantity: quantity, // 재고 수량
        };

        // 기존 장바구니 항목 가져오기, 장바구니가 없으면 빈 배열로 초기화
        let cart = JSON.parse(localStorage.getItem('cart'));
        if (!cart) {
            cart = [];
        }

        // 장바구니에 상품 추가 또는 수량 업데이트
        const existingItemIndex = cart.findIndex(item => item.productId === product.productId);
        if (existingItemIndex > -1) {
            // 이미 장바구니에 있는 상품의 경우 수량 업데이트
            cart[existingItemIndex].quantity = quantity;
        } else {
            // 장바구니에 없는 상품인 경우 새로 추가
            cart.push(cartItem);
        }

        // 업데이트된 장바구니를 localStorage에 저장
        localStorage.setItem('cart', JSON.stringify(cart));
    });

    const payButton = document.createElement('button');
    payButton.innerHTML = '결제하기';
    payButton.addEventListener("click", async () => {
        window.location.href = "/cart";
    });

    item.append(addCartButton);
    item.append(payButton);

    productListWrapper.append(item);
    console.log("상품을 정상적으로 업로딩했습니다.");
}
