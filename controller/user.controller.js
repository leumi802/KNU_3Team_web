const userController = require("express").Router();
const bcrypt = require("bcryptjs");
const {
  createUser,
  getUserByEmail,
  getUserByMypage,
} = require("../service/user.service");
const jwt = require("jsonwebtoken");

// 404 NotFound
// 400 BadRequest
// 401 Unauthorized

// 로그인
// 몽고디비에 있는 회원정보의 값과 비교 (고유한 값 email끼리 서로 비교해 DB에 값을 받아와 회원정보의 값과 비교)
// 1. 몽고디비에서 Email을 기준으로 회원정보를 가져온다.
// 2. 사용자가 입력한 password와 서로 일치한지 비교한다.
// 3. 입력이 일치할 시 로그인 성공, 아닐시 실패 (통과할때 토큰 껴주기(로그인 유지))
// 4. 끝!
userController.post("/signin", async (req, res) => {
  const body = req.body;
  // 사용자로부터 이메일과 패스워드 받음
  const email = body.email;
  const password = body.password;
  // 이메일 혹은 패스워드 둘 중하나라도 없을 시 out
  if (!email || !password) {
    return res
      .status(400)
      .json({ result: false, message: "(!)로그인 정보가 올바르지 않습니다." });
  }

  // 1. email을 기준으로 DB에서 유저 데이터를 꺼내와야 함.
  const user = await getUserByEmail(email); //email을 기준으로 뽑아오니 인자가 email
  // isExistuser의 값은? User or null, 만약 user정보가 없으면 out
  if (!user) {
    return res
      .status(404)
      .json({ result: false, message: "(!)회원 정보가 없습니다." });
  }

  // 유저 정보 User가 실제 있는 구간
  //IsValidPassword는 암호화된 비번을 비교함, compareSync는 비교해서 bool값으로 반환
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
      .json({ isError: true, message: "잘못된 email 입니다." });
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

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

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

// 토큰 유효성 검증
userController.post("/mypage", async (req, res) => {
  const { token } = req.body;
  console.log(token);
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verified);

    const { email, nickname } = verified;
    console.log("Email:", email, "Nickname:", nickname);

    const user = await getUserByMypage(email, nickname);
    return res
      .status(200)
      .json({ isVerify: true, message: "토큰 확인 완료", email, nickname });
  } catch (err) {
    console.log("검증 실패");
    return res
      .status(400)
      .json({ isVerify: false, message: "(!)유효하지 않은 토큰" });
  }
});

module.exports = userController;
