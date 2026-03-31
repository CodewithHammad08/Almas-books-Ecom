import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Admin password must be at least 8 characters"]
    },
    role: {
        type: String,
        enum: ["superadmin", "admin"],
        default: "admin"
    },
    permissions: {
        type: [String],
        enum: ["manage_products", "manage_orders", "manage_users", "manage_categories", "manage_print_requests", "view_analytics"],
        default: ["manage_products", "manage_orders", "manage_users", "manage_categories", "manage_print_requests", "view_analytics"]
    },
    phone: {
        type: String,
        default: ""
    },
    refreshToken: {
        type: String,
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Hash password before save
AdminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

AdminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

AdminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, name: this.name, role: this.role, model: "Admin" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY, algorithm: "HS256" } // ✅ explicit algorithm
    );
};

AdminSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id, model: "Admin" },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY, algorithm: "HS256" } // ✅ explicit algorithm
    );
};

export const Admin = mongoose.model("Admin", AdminSchema);
