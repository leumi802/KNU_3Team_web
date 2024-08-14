window.addEventListener("load", () => {
    console.log("로그인 페이지 로딩 완료.");
});

const signinEmail = document.getElementById("signin_email");
const signinPassword = document.getElementById("signin_password");
const signinButton = document.getElementById("signin_button");

signinButton.addEventListener("click", async () => {
    const email = signinEmail.value;
    const password = signinPassword.value;
    //fetch 비동기
    try {
        const signintResult = await fetch("/api/user/signin", {
            method: "post",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (signinResult.ok) {
            const result = await signinResult.json();
            console.log("로그인 성공", result); //체크
            localStorage.setItem("token", result.token); //토큰 저장
        } else {
            alert("(!)로그인 오류.");
        }
    } catch (err) {
        console.error(err);
        alert("(!)로그인 오류");
    }
});
