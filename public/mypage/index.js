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
      console.log(data);
      const content = document.getElementById("content");
      content.innerHTML = `
                <h1>[마이페이지]</h1>
                <p>Email : ${data.email}</p>
                <p>Nickname : ${data.nickname}</p>
                `;
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
