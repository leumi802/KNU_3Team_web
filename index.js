const express = require("express");
const app = express();
const apiController = require("./controller");

app.use(express.json());
app.use(express.static("public"));
console.log("exec express");
app.use("/api", apiController);

app.post("/api/login", (req, res) => {
  const body = req.body;
  const { email, password } = body;
  // const email = body.email;
  // const password = body.password;
  console.log(email, password);
  // DB에 해당 'email', 'password'  조회해서 로그인 여부 판단
  return res.json({ message: "로그인 성공" });
});

app.listen(8000, () => {
  console.log("Express Running on 8000");
});
