import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { PrintRequest } from "../models/printRequest.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from "axios";
import path from "path";

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

/**
 * Proxy the stored Cloudinary file through the backend.
 * This avoids ALL browser CORS / Content-Disposition issues —
 * the backend fetches the raw bytes and forwards them with the
 * correct Content-Type and Content-Disposition: inline headers.
 */
const streamPrintFile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const printRequest = await PrintRequest.findById(id);
    if (!printRequest || !printRequest.fileUrl) {
        throw new ApiError(404, "Print request or file not found");
    }

    const fileUrl = printRequest.fileUrl
        .replace(/^http:\/\//, "https://")
        .replace("/fl_inline/", "/");   // strip legacy flag — causes 401 on raw resources
    const fileName = printRequest.fileName || "document";
    const ext = path.extname(fileName).toLowerCase();

    // Map common extensions to MIME types
    const mimeMap = {
        ".pdf":  "application/pdf",
        ".jpg":  "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png":  "image/png",
        ".gif":  "image/gif",
        ".webp": "image/webp",
        ".doc":  "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xls":  "application/vnd.ms-excel",
        ".ppt":  "application/vnd.ms-powerpoint",
        ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".txt":  "text/plain",
        ".csv":  "text/csv",
    };
    const contentType = mimeMap[ext] || "application/octet-stream";

    // Fetch from Cloudinary via axios (follows redirects automatically)
    console.log("📄 Fetching file URL:", fileUrl);
    try {
        const cloudinaryRes = await axios.get(fileUrl, { responseType: "stream" });
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
        res.setHeader("Cache-Control", "public, max-age=3600");
        cloudinaryRes.data.pipe(res);
    } catch (err) {
        console.error("❌ File proxy error:", err?.message);
        res.status(502).json({ message: "Could not load file from storage" });
    }
});

export {
    submitPrintRequest,
    getAllPrintRequests,
    updatePrintRequestStatus,
    streamPrintFile,
};

