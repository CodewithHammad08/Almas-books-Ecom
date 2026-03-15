import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  rating: Number,
  comment: String
}, { timestamps: true });

export const Review = mongoose.model("Review", ReviewSchema);
