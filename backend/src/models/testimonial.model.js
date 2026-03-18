import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    showOnHome: { type: Boolean, default: true }
}, { timestamps: true });

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
