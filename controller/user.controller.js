const bcrypt = require("bcryptjs");
const { createUser } = require("../service/user.service");
const userController = require("express").Router();

// userController.patch("/changepassword", (req, res) => {});

userController.post("/", async (req, res) => {
    const { email, password, nickname } = req.body;
    console.log(req.body);

    // 1. email 검증 (이상한 요청은 service로 보내지 않도록 걸러주는 작업)
    if (!email.includes("@")) {
        return res
            .status(400)
            .json({ isError: true, message: "잘못된 email 입니다."}); // http status code
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