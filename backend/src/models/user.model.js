import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
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
        required: function () { return this.authProvider === "local"; },
        minlength: [6, "Password must be at least 6 characters"]
    },
    phone: {
        type: String,
        default: ""
    },
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        pincode: { type: String, default: "" }
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    refreshToken: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Hash password before save
UserSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, name: this.name, role: "user", model: "User" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY, algorithm: "HS256" } // ✅ explicit algorithm
    );
};

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id, model: "User" },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY, algorithm: "HS256" } // ✅ explicit algorithm
    );
};

export const User = mongoose.model("User", UserSchema);