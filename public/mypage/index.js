// 1, 프론트
// 사용자가 [마이페이지] 버튼 혹은 직접 url을 입력해서 이동한다.
// http://localhost:8000/mypage
window.addEventListener("load", async () => {
  console.log("마이 페이지 로딩 완료.");
});

const mypageButton = document.getElementById("mypage_button");
const content = document.getElementById("content");

mypageButton.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  try {
    const mypageResult = await fetch("/api/user/mypage/", {
      method: "post",
      body: JSON.stringify({ token }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (mypageResult.ok) {
      const data = await mypageResult.json();

      // 마이페이지 컨텐츠 표시
      content.innerHTML = `
                <h1>[마이페이지]</h1>
                <p>Email : ${data.email}</p>
                <p>Nickname : ${data.nickname}</p>
                `;
    } else {
      alert("(!)마이페이지 로드 오류");
    }
  } catch (err) {
    console.error(err);
    alert("(!)오류 발생");
  }
});

// 2, 프론트+백엔드
// 사용자가 페이지 접근 후, localStorage에 있는 token을 꺼내서
// 백엔드로 보내서, 해당 토큰의 유효성을 검증한다.
// JWT.verity(token, process.env.JWT_SECRET)

// 3, 백엔드
// 유효성 검증 결과에 따른 사용자 인증여부를 프론트로 반환한다.
// res.json({isVerify:true})

// 4, 프론트
// 3번으로부터 받은 응답값을 통해서 token이 유효하다면
// 그대로 페이지 사용을 하게한다. 만약 token이 유효x면
// signin 페이지로 보내준다.
