// 2) 사용자가 페이지 접근 후, (window.addevent(load)) ok
window.addEventListener("load", async () => {
  console.log("마이 페이지 로딩 완료.");
  // localStorage에 있는 token을 꺼내서 (localStorage.getItem("token"); ok
  const token = localStorage.getItem("token");
  // token이 가져와졌는지 체크
  if (token === null) {
    // 오류 뜰 곳
    alert("(!)토큰이 존재하지 않음.");
  }
  try {
    // 백엔드로 보내서(fetch) ok
    const verifyResult = await fetch("/api/user/mypage", {
      method: "post",
      body: JSON.stringify({ token }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (verifyResult.ok) {
      const data = await verifyResult.json();
      setContent(data);
      // console.log(data);
    } else {
      alert("토큰이 유효하지 않습니다. 로그인 페이지로 이동합니다.");
      localStorage.removeItem("token"); // 현재 토큰 제거
      window.location.href = "http://localhost:8000/signin";
    }
  } catch (err) {
    console.error(err);
    alert("(!)오류 발생");
  }
});

const setContent = (data) => {
  document.getElementById("user_nickname").innerHTML = `${data.nickname}`; // 유저 닉네임
  document.getElementById("user_email").innerHTML = `${data.email}`; // 유저 이메일
  document.getElementById("cart_num").innerHTML = localStorage.getItem("cart") // 장바구니 아이템 개수
    ? `${JSON.parse(localStorage.getItem("cart")).length}`
    : `0`;
};

document.getElementById("product").addEventListener("click", () => {
  // 쇼핑하기 버튼
  window.location.href = "http://localhost:8000/product"; // 상품 리스트 페이지로 이동
});

document.getElementById("cart").addEventListener("click", () => {
  // 장바구니 버튼
  window.location.href = "http://localhost:8000/cart"; // 장바구니 페이지로 이동
});

document.getElementById("order").addEventListener("click", () => {
  // 결제하기 버튼
  window.location.href = "http://localhost:8000/order"; // 결제 페이지로 이동
});

document.getElementById("logout_btn").addEventListener("click", () => {
  localStorage.removeItem("token"); // 토큰 제거
  alert("로그아웃 되었습니다");
  window.location.href = "http://localhost:8000/signin"; // 로그인 페이지로 이동
});
