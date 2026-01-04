import mongoose, { mongo } from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: String,
    orderId: String,
    products: [
        {
            productId: {type: String, required: true},
            quantity: {type: Number, required: true}
        }
    ],
    email: {type: String, required: true},
    amount: Number,
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "failed"],
        default: "pending"
    }
},{
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

export default Order;