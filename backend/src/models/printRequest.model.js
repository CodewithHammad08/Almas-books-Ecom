import mongoose from "mongoose";

const PrintRequestSchema = new mongoose.Schema({
    // Optional link to a registered user (null for guest submissions)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    // Contact info (required since user may be a guest)
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"]
    },
    email: {
        type: String,
        default: "",
        lowercase: true
    },
    // File details
    fileUrl: {
        type: String,
        required: [true, "File is required"]
    },
    fileName: {
        type: String,
        default: ""
    },
    // Print options
    copies: {
        type: Number,
        required: [true, "Number of copies is required"],
        min: [1, "At least 1 copy required"],
        default: 1
    },
    printType: {
        type: String,
        enum: ["black-white", "color", "both-sides"],
        required: [true, "Print type is required"]
    },
    paperSize: {
        type: String,
        enum: ["A4", "A3", "Letter"],
        default: "A4"
    },
    bindingType: {
        type: String,
        enum: ["none", "spiral", "staple"],
        default: "none"
    },
    notes: {
        type: String,
        default: ""
    },
    // Pricing
    totalCost: {
        type: Number,
        default: null  // set by admin when reviewing
    },
    // Workflow status
    status: {
        type: String,
        enum: ["pending", "reviewing", "printing", "ready", "completed", "cancelled"],
        default: "pending"
    }
}, { timestamps: true });

export const PrintRequest = mongoose.model("PrintRequest", PrintRequestSchema);
