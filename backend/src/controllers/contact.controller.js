import { Contact } from "../models/contact.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const submitContact = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, subject, message, rating } = req.body;

    if (!firstName || !lastName || !email || !message) {
        throw new ApiError(400, "Required fields are missing");
    }

    const contact = await Contact.create({
        firstName, 
        lastName, 
        email, 
        phone: phone || "", 
        subject: subject || "", 
        message, 
        rating: rating || 0
    });

    return res.status(201).json(
        new ApiResponse(201, contact, "Message submitted successfully")
    );
});

const getTestimonials = asyncHandler(async (req, res) => {
    // Fetch contacts with rating >= 4 to show on home page as testimonials
    const testimonials = await Contact.find({ rating: { $gte: 4 }, showOnHome: true })
        .sort({ createdAt: -1 })
        .limit(6);

    return res.status(200).json(
        new ApiResponse(200, testimonials, "Testimonials fetched successfully")
    );
});

export { submitContact, getTestimonials };
