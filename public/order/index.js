window.addEventListener("load", async () => {
  // localStorage에 있는 token을 꺼내서 (localStorage.getItem("token");
  const token = localStorage.getItem("token");
  // token이 가져와졌는지 체크
  if (token === null) {
    // 오류 뜰 곳
    alert("(!)토큰이 존재하지 않음.");
  }
  try {
    const Result = await fetch("/api/user/mypage", {
      method: "post",
      body: JSON.stringify({ token }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (Result.ok) {
      const data = await Result.json();
      setContent(data);
      return data;
    } else {
      alert("토큰이 유효하지 않습니다. 로그인 페이지로 이동합니다.");
      localStorage.removeItem("token"); // 현재 토큰 제거
      window.location.href = "http://localhost:8000/signin";
    }
  } catch (error) {
    console.error("Fetch 오류:", error);
    return [];
  }
});

// 구매자의 ID를 가져오는 함수 정의
const setContent = (data) => {
  const postid = data.email; // data.email을 여기서 사용
  const postname = document.getElementById("postname");
  const postemail = document.getElementById("postemail");
  const postphone = document.getElementById("postphone");
  const getname = document.getElementById("getname");
  const getadress = document.getElementById("getadress");
  const getphone = document.getElementById("getphone");
  const products = JSON.parse(localStorage.getItem("cart")) || [];

  const payButton = document.getElementById("order");

  payButton.addEventListener("click", () => {
    if (!postname.value) {
      alert("구매자 정보를 입력해주세요.");
    } else if (!postemail.value || !postemail.value.includes("@")) {
      alert("구매자 이메일을 바르게 입력해주세요.");
    } else if (!postphone.value) {
      alert("구매자의 전화번호를 입력해주세요.");
    } else if (!getname.value) {
      alert("받는사람의 이름을 입력해주세요.");
    } else if (!getadress.value) {
      alert("주소를 입력해주세요.");
    } else if (!getphone.value) {
      alert("받는사람의 전화번호를 입력해주세요.");
    } else {
      alert("성공");
      const user = {
        buyerId: postid,
        buyerName: postname.value,
        buyerEmail: postemail.value,
        buyerPhoneNum: postphone.value,
        recipientName: getname.value,
        recipientAddress: getadress.value,
        recipientPhoneNum: getphone.value,
        products: products,
      };
      // 대충 여기서 fetch활용해서 method:"post", body:JSON({user}), headers: 뭐였지
      // 해주면 될듯 함
    }
  });
};
