const userController = require("express").Router();
const bcrypt = require("bcryptjs");
const { createUser, getUserByEmail } = require("../service/user.service");
const jwt = require("jsonwebtoken");

// 404 NotFound
// 400 BadRequest
// 401 Unauthorized

// userController.patch("/changepassword", (req, res) => {});

// 로그인
userController.post("/signin", async (req, res) => {
  // 사용자로부터 email과 password를 받음
  const { email, password } = req.body;

  // 0. email혹은 password 둘 중 하나라도 없으면 false
  if (!email || !password) {
    return res
      .status(400)
      .json({ result: false, message: "(!)로그인 정보가 올바르지 않습니다." });
  }

  // 1. email을 기준으로 DB에서 유저 데이터를 꺼내와야 함.
  const user = await getUserByEmail(email);
  if (!user) {
    return res
      .status(404)
      .json({ result: false, message: "(!)회원 정보가 없습니다." });
  }

  // 유저 정보 User가 실제 있는 구간
  const isValidPassword = bcrypt.compareSync(password, user.password);
  console.log(isValidPassword);
  if (isValidPassword) {
    // token을 끼워넣기.
    const token = jwt.sign(
      { email: user.email, nickname: user.nickname },
      process.env.JWT_SECRET
    ); // payload: 사용자를 특정할 수 있는 정보..
    return res
      .status(200)
      .json({ result: true, message: "로그인 성공", token });
  } else {
    return res
      .status(400)
      .json({ result: false, message: "(!)비밀번호가 올바르지 않습니다." });
  }
});

// 회원가입
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

module.exports = userController;
