import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: Number,
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    pincode: String
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "Online"]
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered"],
    default: "pending"
  }
}, { timestamps: true });

export const Order = mongoose.model("Order", OrderSchema);
