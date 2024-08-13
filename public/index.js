window.addEventListener("load", () => {
    console.log("로그인 페이지 로딩 완료.");
});

const emailInput = document.getElementById("user_email");
const passwordInput = document.getElementById("user_password");
const loginButton = document.getElementById("login_button");

loginButton.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    console.log(email, password);

    const fetchLogin = await fetch("/api/login", { 
        method: "post", 
        body: JSON.stringify({ 
            email: email, 
            password: password,
        }),
        headers: {
            "Content-Type": "application/json"
        },
    });
    if (fetchLogin.ok) {
        const loginResult = await fetchLogin.json();
        console.log(loginResult);
    }
});