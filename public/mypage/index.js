// 2) 사용자가 페이지 접근 후, (window.addevent(load)) ok
window.addEventListener("load", async () => {
  console.log("마이 페이지 로딩 완료.");
  // localStorage에 있는 token을 꺼내서 (localStorage.getItem("token"); ok
  const token = localStorage.getItem("token");
  // token이 가져와졌는지 체크 ㄱㄷ
  if (token == undefined) {
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
    } else {
      alert("토큰이 유효하지 않습니다. 로그인 페이지로 이동합니다.");
      localStorage.removeItem("token"); // 'token'은 현재 사용중이던 토큰을 사용
      window.location.href = "http://localhost:8000/signin";
    }
  } catch (err) {
    console.error(err);
    alert("(!)오류 발생");
  }
});

// (프론트+백)
// 2) 사용자가 페이지 접근 후, (window.eventlis(load)) ok
// localStorage에 있는 token을 꺼내서 (localStorage.getItem("token",.token);)
// 백엔드로 보내서(fetch), 해당 토큰을 유효성을 검증한다. (verify)
//
// window.eventlisn 이벤트 접근 감지(load)
// local getitem 토큰 가져오기
// verify(tkn, process.env.JWT_SECRET) 유효성 검증
//

// const response = ("3)으로 부터 return 받은 값 저장");
// 새로운 페이지 시작 시 계속 이 함수 사용..?
function responseVerification(response) {
  if (response.isVerify) {
    // 토큰이 유효한 경우, 현재 페이지를 계속 사용
    console.log("토큰이 유효합니다. 마이페이지를 사용하세요.");
  } else {
    console.log("토큰이 유효하지 않습니다. 로그인 페이지로 이동합니다.");
    localStorage.removeItem("token"); // 'token'은 현재 사용중이던 토큰을 사용
    window.location.href = "http://localhost:8000/signin";
  }
}
