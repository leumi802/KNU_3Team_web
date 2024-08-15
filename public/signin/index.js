const signinEmail = document.getElementById("signin_email");
const signinPassword = document.getElementById("signin_password");
const signinButton = document.getElementById("signin_button");
const gotoSignup = document.getElementById("goto_signup");

signinButton.addEventListener("click", async () => {
  const email = signinEmail.value;
  const password = signinPassword.value;
  try {
    const signinResult = await fetch("/api/user/signin", {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    }); // 자동으로 key: value 로 인식해서 써줌(원래는 email:email, password:password)

    if (signinResult.ok) {
      const result = await signinResult.json();
      console.log("로그인 성공", result);
      localStorage.setItem("token", result.token);
      window.location.href = "http://localhost:8000/product";
    } else {
      alert("(!)로그인 오류");
    }
  } catch (err) {
    console.log(err);
    alert("(!)로그인 오류");
  }
});

gotoSignup.addEventListener("click", () => {
  window.location.href = "http://localhost:8000/signup";
});
