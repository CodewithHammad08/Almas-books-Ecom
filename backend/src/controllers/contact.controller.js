import { Contact } from "../models/contact.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const submitContact = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
        throw new ApiError(400, "Required fields are missing");
    }

    const contact = await Contact.create({
        firstName, 
        lastName, 
        email, 
        phone: phone || "", 
        subject: subject || "General Inquiry", 
        message
    });

    return res.status(201).json(
        new ApiResponse(201, contact, "Message submitted successfully")
    );
});

export { submitContact };
