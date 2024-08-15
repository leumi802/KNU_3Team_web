const mongoose = require("mongoose");
const { String } = mongoose.Schema.Types;
const orderSchema = new mongoose.Schema({
  // 여기에 user의 고유id (email)=> _id 를 받으면 됨
  buyerId: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
