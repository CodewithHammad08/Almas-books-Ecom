import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    // Snapshot fields — stored at order time in case product is later edited/deleted
    productName: { type: String, required: true },
    productImage: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [OrderItemSchema],
        required: true,
        validate: [(arr) => arr.length > 0, "Order must have at least one item"]
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    shippingAddress: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Online"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending"
    },
    orderStatus: {
        type: String,
        enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    notes: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const Order = mongoose.model("Order", OrderSchema);
