// DB에 접근

const User = require("../schema/user.schema");

// Controller에서 호출
// user = { email: "", nickname: "", password: "" }
const createUser = async (user) => {
  // Express <---> DB - 무슨 에러가 날지 알 수 없음.
  try {
    const createduser = await User.create(user); // mongoDB에 접근. DB 접근하는 작업은 Service에서만.
    console.log(createduser);
  } catch (err) {
    console.log(err);
  }
};

const getUserByMypage = async (email, nickname) => {
  try {
    const user = await User.findOne({ email, nickname });
    console.log(user);
    return user;
  } catch (err) {
    return null;
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    console.log(user); // user 정보가 가져와졌는지 확인
    return user;
  } catch (err) {
    return null;
  }
};

// 얘는 DB에 직접 접근하는 애임

module.exports = {
  createUser,
  getUserByMypage,
  getUserByEmail,
};
