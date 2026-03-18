import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    subject: { type: String, required: false },
    message: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    showOnHome: { type: Boolean, default: true }
}, { timestamps: true });

export const Contact = mongoose.model("Contact", contactSchema);
