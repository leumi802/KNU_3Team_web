const bcrypt = require("bcryptjs");
const { createUser, getUserByEmail } = require("../service/user.service");
const userController = require("express").Router();
const jwt = require("jsonwebtoken");

// userController.patch("/changepassword", (req, res) => {});
// 로그인도 post로 작성한 이유 : body를 사용할 수 있ㄴ...?get으로 작성시 url에 password가 노출이 됨.
// email을 기준으로 DB에서 회원정보 데이터를 꺼내와서 EXPRESS에서 검증을함.
// 클라이언트에서 사용자가 입력한 password와 DB password와 비교를 함(EXPRESS에서) 여기서 똑같으면 로그인 성공, 아니면 실패
// 


userController.post("/signin", async (req, res) => {
    const body = req.body;
    // 사용자로부터 email 과 password를 받음
    const email = body.email;
    const password = body.password;
    // email or password 둘 중 하나라도 없으면? 나가라
    if (!email || !password) {
        return res.status(400).json({ result: false, message: "(!)로그인 정보가 올바르지 않습니다." });
    }
    // 여기까지는 사용자가 잘못입력했을때의 예외처리 해준거임
    // email을 기준으로 DB에서 유저 데이터를 가져와야 함(고유한 값)

    // eamil을 뽑아왔을때 존재하는지 보는 거임
    // DB와 통신을 하는거기 때문에 언제 정보가 돌아올지 모름, 그래서 await을 써줌
    const user = await getUserByEmail(email);
    // 여기로 들어오는 값은 User | null       만약 유저 정보가 없으면 나가라
    if (!user) {
        return res.status(404).json({ result: false, message: "(!)회원 정보가 없습니다." });
    }
    // 위 코드에서 걸리지 않은거면 
    // 여기 부분 부터는 User가 실제 있는 구간                   bcrypt에서 암호화 시켜줬던걸 토대로 비교해줌
    const isValidPassword = bcrypt.compareSync(password, user.password); // boolean 타입으로 반환됨 [password === user.password ==> isValidPassword]
    if (isValidPassword) {

        // 로그인 성공시 token 끼워 넣기
        const token = jwt.sign({ email: user.email, nickname: user.nickname }, process.env.JWT_SECRET);
        return res.status(200).json({ result: true, message: "로그인 성공", token });            // 200은 아무이상없이 실행됐다.
    } else {
        return res.status(400).json({ result: false, message: "(!)비밀번호가 올바르지 않습니다." });
    }


});

userController.post("/", async (req, res) => {
    const { email, password, nickname } = req.body;
    console.log(req.body);

    // 1. email 검증 (이상한 요청은 service로 보내지 않도록 걸러주는 작업)
    if (!email.includes("@")) {
        return res
            .status(400)
            .json({ isError: true, message: "잘못된 email 입니다." }); // http status code
    }

    // 2. password 검증
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;
    if (!passwordRegex.test(password)) {
        return res
            .status(400)
            .json({ isError: true, message: "잘못된 비밀번호형식 입니다." });
    }

    // 3. nickname 검증
    if (nickname.length < 2) {
        return res
            .status(400)
            .json({ isError: true, message: "잘못된 닉네임 입니다." });
    }

    const salt = bcrypt.genSaltSync(10); // 너무 많이 돌리면 서버가 멈춘다.
    const hashedPassword = bcrypt.hashSync(password, salt); // 2번째 인자는 salt (옵션). salt를 넣으면 더 복잡한 암호화가 된다.

    const user = {
        email,
        nickname,
        password: hashedPassword,
    };
    try {
        await createUser(user);
        return res.status(201).json({ result: true });
    } catch (err) {
        return res.status(500).json({ result: false });
    }
});

// 404 NotFound
// 400 BadRequest
// 401 Unauthorized

module.exports = userController;