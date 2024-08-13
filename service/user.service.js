const User = require("../schema/user.schema")

// Controller에서 호출
// user = { email: "", nickname: "", password: "" }
const createUser = async (user) => {
    // Express <---> DB - 무슨 에러가 날지 알 수 없음.
    try {
        const user = await User.create(user); // mongoDB에 접근. DB 접근하는 작업은 Service에서만.
    } catch (err) {}
};

const getUser = async (email, password) => {
    const user = await User.findOne({});
};

module.exports = {
    createUser,
};