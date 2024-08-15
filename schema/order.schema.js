const mongoose = require("../db_init");
const { String, Number, Array } = mongoose.Schema.Types;
const orderSchema = new mongoose.Schema(
    {
        buyerId: {
            // user 모델에 있는 Object ID임 결제한 사람의 ID를 땡겨와야함
            type: String,
            required: true,
        },
        buyerName: {
            type: String,
            required: true,
        },
        buyerEmail: {
            type: String,
            required: true,
        },
        buyerPhoneNum: {
            type: Number,
            required: true,
        },
        recipientName: {
            type: String,
            required: true,
        },
        recipientAddress: {
            type: String,
            required: true,
        },
        recipientPhoneNum: {
            type: Number,
            required: true,
        },
        products: {
            type: Array, // ((product:1, productTitle:title1))
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;