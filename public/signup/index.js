const signupEmail = document.getElementById("signup_email");
const signupPassword = document.getElementById("signup_password");
const signupNickname = document.getElementById("signup_nickname");
const signupButton = document.getElementById("signup_button");
const gotoSignin = document.getElementById("goto_signin");

signupButton.addEventListener("click", async () => {
  const user = {
    email: signupEmail.value,
    password: signupPassword.value,
    nickname: signupNickname.value,
  };
  console.log(user);
  try {
    const signupResult = await fetch("/api/user/", {
      method: "post",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (signupResult.ok) {
      alert("회원가입 성공");
      window.location.href = "/signin";
    } else {
      alert("(!)회원가입 실패");
    }
  } catch (err) {
    console.error(err);
  }
});

gotoSignin.addEventListener("click", () => {
  window.location.href = "http://localhost:8000/signin";
});
