const buttonDiv = document.getElementById("button"); // 버튼을 추가할 div 요소 선택
const addCartButton = document.createElement('button'); // 상품 추가 버튼 생성
addCartButton.innerHTML = '쇼핑 계속하기';

// 버튼 클릭 이벤트 리스너 추가
addCartButton.addEventListener("click", () => {

    // 다른 페이지로 넘어갈때 토큰 검증해주는 함수

    alert("쇼핑을 계속합니다.");
    window.location.href = "/product";
});

// 생성한 버튼을 buttonDiv에 추가
buttonDiv.appendChild(addCartButton);