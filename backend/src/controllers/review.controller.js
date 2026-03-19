import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
        throw new ApiError(400, "All fields are required");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
        user: req.user._id,
        product: productId
    });

    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this product");
    }

    const review = await Review.create({
        user: req.user._id,
        product: productId,
        rating,
        comment
    });

    // Update product rating and review count
    const reviews = await Review.find({ product: productId });
    const numReviews = reviews.length;
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

    product.rating = avgRating;
    product.reviewsCount = numReviews;
    await product.save();

    return res.status(201).json(
        new ApiResponse(201, review, "Review added successfully")
    );
});

const getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
        .populate("user", "name")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, reviews, "Reviews fetched successfully")
    );
});

export {
    addReview,
    getProductReviews
};
