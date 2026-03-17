import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
        default: 1
    },
    priceAtAdd: {
        type: Number,
        required: true  // price snapshot when item was added
    }
}, { _id: false });

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true  // one cart per user
    },
    items: {
        type: [CartItemSchema],
        default: []
    },
    totalAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const Cart = mongoose.model("Cart", CartSchema);
