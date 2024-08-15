require("dotenv").config();
console.log(process.env.MONGODB_URL);
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("mongodb connected"))
  .catch((err) => {
    console.log("(!)Occured error from connecting mongodb");
    console.log(err);
    process.exit();
  });

module.exports = mongoose;
