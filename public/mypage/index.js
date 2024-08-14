// 2) 사용자가 페이지 접근 후, (window.addevent(load)) ok
window.addEventListener("load", async () => {
  console.log("마이 페이지 로딩 완료.");
  try {
    // localStorage에 있는 token을 꺼내서 (localStorage.getItem("token"); ok
    // token이 가져와졌는지 체크 ㄱㄷ
    const token = localStorage.getItem("token");
    if (token === undefined) {
      // 오류 뜰 곳
      alert("대충 오류라는 뜻");
    } else {
      // 백엔드로 보내서(fetch) ok
      const verifyResult = await fetch("/api/user/mypage", {
        method: "post",
        body: JSON.stringify({ token }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (err) {
    console.log(err);
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
