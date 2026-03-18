import { Testimonial } from "../models/testimonial.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const submitTestimonial = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, message, rating } = req.body;

    if (!firstName || !lastName || !email || !message || !rating) {
        throw new ApiError(400, "Required fields are missing");
    }

    const testimonial = await Testimonial.create({
        firstName, 
        lastName, 
        email, 
        message, 
        rating
    });

    return res.status(201).json(
        new ApiResponse(201, testimonial, "Testimonial submitted successfully")
    );
});

const getTestimonials = asyncHandler(async (req, res) => {
    // Fetch testimonials with rating >= 4 to show on home page
    const testimonials = await Testimonial.find({ rating: { $gte: 4 }, showOnHome: true })
        .sort({ createdAt: -1 })
        .limit(6);

    return res.status(200).json(
        new ApiResponse(200, testimonials, "Testimonials fetched successfully")
    );
});

export { submitTestimonial, getTestimonials };
