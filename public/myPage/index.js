// const response = ("3)으로 부터 return 받은 값 저장");
// 새로운 페이지 시작 시 사용
function responseVerification(response) {
    if (!response.isVerify) {
        console.log("토큰이 유효하지 않습니다. 로그인 페이지로 이동합니다.");
        alert("(!)로그인 페이지로 이동합니다.");
        localStorage.removeItem('token'); // 'token'은 현재 사용중이던 토큰을 사용
        window.location.href = 'http://localhost:8000/signin';
    }
}
