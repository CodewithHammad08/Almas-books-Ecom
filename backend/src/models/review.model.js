import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        default: "",
        maxlength: [100, "Review title too long"]
    },
    comment: {
        type: String,
        default: "",
        maxlength: [1000, "Review comment too long"]
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false  // set to true if user has an order containing this product
    }
}, { timestamps: true });

// One review per user per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export const Review = mongoose.model("Review", ReviewSchema);
