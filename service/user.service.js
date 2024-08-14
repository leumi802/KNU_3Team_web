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

const getUser = async (email, password) => {
  const user = await User.findOne({});
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    console.log(user);
    return user;
  } catch (Err) {
    return null;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
};
