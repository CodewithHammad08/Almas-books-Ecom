import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { PrintRequest } from "../models/printRequest.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const submitPrintRequest = asyncHandler(async (req, res) => {
    const { name, phone, copies, printType, notes, paperSize, bindingType } = req.body;

    if (!name || !phone || !copies || !printType) {
        throw new ApiError(400, "Name, phone, copies, and printType are required");
    }

    // Normalize printType values from frontend to match model enum
    const printTypeMap = {
        "black & white": "black-white",
        "black&white": "black-white",
        "color": "color",
        "colour": "color",
        "both-sides": "both-sides",
        "both sides": "both-sides",
    };
    const normalizedType = printTypeMap[printType.toLowerCase()] || "black-white";

    if (!req.file) {
        throw new ApiError(400, "Print request document file is required");
    }

    const uploadedFile = await uploadOnCloudinary(req.file.path);
    if (!uploadedFile) {
        throw new ApiError(500, "Error uploading document file to Cloudinary");
    }

    const printRequest = await PrintRequest.create({
        name,
        phone,
        fileUrl: uploadedFile.secure_url,  // Always use HTTPS so browsers can render PDFs inline
        fileName: req.file.originalname,
        copies: Number(copies),
        printType: normalizedType,
        paperSize: paperSize || "A4",
        bindingType: bindingType || "none",
        notes,
        status: "pending"
    });

    return res.status(201).json(new ApiResponse(201, printRequest, "Print request submitted successfully"));
});

const getAllPrintRequests = asyncHandler(async (req, res) => {
    const requests = await PrintRequest.find().sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, requests, "Print requests fetched successfully"));
});

const updatePrintRequestStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const printRequest = await PrintRequest.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true }
    );

    if (!printRequest) {
        throw new ApiError(404, "Print request not found");
    }

    return res.status(200).json(new ApiResponse(200, printRequest, "Print request status updated successfully"));
});

export {
    submitPrintRequest,
    getAllPrintRequests,
    updatePrintRequestStatus
};
