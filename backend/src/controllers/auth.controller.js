import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Cookie options ────────────────────────────────────────────────────────────
// sameSite: "lax" is required when frontend (localhost:5173) proxies to backend
// (localhost:8000) via Vite. "strict" breaks cookie sending through the proxy.
// In production, HTTPS + secure:true provides CSRF protection.
const accessCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000                   // 15 minutes
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000         // 7 days
};

// ── Input guard: ensure critical inputs are plain strings ─────────────────────
const assertStrings = (...vals) => {
    for (const v of vals) {
        if (typeof v !== "string") {
            throw new ApiError(400, "Invalid input format");
        }
    }
};

// ── REGISTER ──────────────────────────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email and password are required");
    }
    assertStrings(name, email, password);

    // Block if email belongs to an admin (generic message — no info leak)
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) throw new ApiError(409, "This email is not available");

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) throw new ApiError(409, "An account with this email already exists");

    const user = await User.create({ name, email, password, phone });
    const created = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, created, "Account created successfully")
    );
});

// ── LOGIN (checks Admin first, then User) ────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }
    assertStrings(email, password);

    // ── Admin path ────────────────────────────────────────────────────────────
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (admin) {
        if (!admin.isActive) throw new ApiError(403, "Account is deactivated");

        const isValid = await admin.isPasswordCorrect(password);
        // ✅ Generic message — prevents admin email enumeration
        if (!isValid) throw new ApiError(401, "Invalid email or password");

        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();
        admin.refreshToken = refreshToken;
        admin.lastLogin = new Date();
        await admin.save({ validateBeforeSave: false });

        const safeAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

        return res
            .status(200)
            .cookie("accessToken", accessToken, accessCookieOptions)
            .cookie("refreshToken", refreshToken, refreshCookieOptions)
            // ✅ accessToken NOT in body — prevents XSS / localStorage leaks
            .json(new ApiResponse(200, { user: { ...safeAdmin.toObject(), role: admin.role } }, "Logged in successfully"));
    }

    // ── User path ─────────────────────────────────────────────────────────────
    const user = await User.findOne({ email: email.toLowerCase() });

    // ✅ Generic 401 for both "not found" AND "wrong password" — prevents enumeration
    const isValid = user ? await user.isPasswordCorrect(password) : false;
    if (!user || !isValid) throw new ApiError(401, "Invalid email or password");
    if (!user.isActive) throw new ApiError(403, "Account is deactivated");

    if (user.authProvider === "google") {
        throw new ApiError(400, "This account uses Google Sign-In. Please use Google login.");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const safeUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(new ApiResponse(200, { user: { ...safeUser.toObject(), role: "user" } }, "Logged in successfully"));
});

// ── REFRESH TOKEN ─────────────────────────────────────────────────────────────
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;
    if (!incomingRefreshToken) throw new ApiError(401, "No refresh token");

    let decoded;
    try {
        decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET, {
            algorithms: ["HS256"]
        });
    } catch {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    // Determine entity type
    let entity;
    if (decoded.model === "Admin") {
        entity = await Admin.findById(decoded._id);
    } else {
        entity = await User.findById(decoded._id);
    }

    if (!entity) throw new ApiError(401, "Unauthorized");

    // ✅ Refresh token reuse detection — if stored token doesn't match, invalidate session
    if (entity.refreshToken !== incomingRefreshToken) {
        entity.refreshToken = null;
        await entity.save({ validateBeforeSave: false });
        throw new ApiError(401, "Refresh token reuse detected — please log in again");
    }

    // ✅ Rotate refresh token
    const newAccessToken = entity.generateAccessToken();
    const newRefreshToken = entity.generateRefreshToken();
    entity.refreshToken = newRefreshToken;
    await entity.save({ validateBeforeSave: false });

    return res
        .status(200)
        .cookie("accessToken", newAccessToken, accessCookieOptions)
        .cookie("refreshToken", newRefreshToken, refreshCookieOptions)
        .json(new ApiResponse(200, {}, "Token refreshed"));
});

// ── GOOGLE LOGIN ──────────────────────────────────────────────────────────────
const googleLogin = asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) throw new ApiError(400, "Google token is required");
    assertStrings(token);

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email } = ticket.getPayload();

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) throw new ApiError(403, "Admin accounts cannot use Google Sign-In");

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, authProvider: "google" });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const safeUser = await User.findById(user._id).select("-password -refreshToken");

        return res
            .status(200)
            .cookie("accessToken", accessToken, accessCookieOptions)
            .cookie("refreshToken", refreshToken, refreshCookieOptions)
            .json(new ApiResponse(200, { user: { ...safeUser.toObject(), role: "user" } }, "Logged in via Google"));
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(401, "Invalid Google token");
    }
});

// ── GET PROFILE ───────────────────────────────────────────────────────────────
const getUserProfile = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Profile fetched successfully")
    );
});

// ── LOGOUT ────────────────────────────────────────────────────────────────────
const logoutUser = asyncHandler(async (req, res) => {
    if (req.user?.model === "Admin") {
        await Admin.findByIdAndUpdate(req.user._id, { refreshToken: null });
    } else {
        await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }

    return res
        .status(200)
        .clearCookie("accessToken", accessCookieOptions)
        .clearCookie("refreshToken", refreshCookieOptions)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ── UPDATE ADDRESS ────────────────────────────────────────────────────────────
const updateUserAddress = asyncHandler(async (req, res) => {
    const { street, city, pincode, phone } = req.body;

    if (!req.user || req.user.model === "Admin") {
        throw new ApiError(403, "Invalid account context for updating delivery addresses");
    }

    // ✅ Explicit field whitelist — no mass assignment
    const updateData = {
        "address.street": typeof street === "string" ? street.trim() : "",
        "address.city": typeof city === "string" ? city.trim() : "",
        "address.pincode": typeof pincode === "string" ? pincode.trim() : ""
    };

    if (phone && typeof phone === "string") {
        updateData.phone = phone.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Address updated successfully")
    );
});

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    getUserProfile,
    googleLogin,
    logoutUser,
    updateUserAddress
};
