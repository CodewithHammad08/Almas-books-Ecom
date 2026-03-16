import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
};

// ─── REGISTER (users only) ────────────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email and password are required");
    }

    // Block if email is already an admin
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        throw new ApiError(409, "This email is reserved");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({ name, email, password, phone });
    const created = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, created, "Account created successfully")
    );
});

// ─── LOGIN (checks Admin first, then User) ────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // 1. Check Admin collection first
    const admin = await Admin.findOne({ email });
    if (admin) {
        if (!admin.isActive) throw new ApiError(403, "Admin account is deactivated");

        const isValid = await admin.isPasswordCorrect(password);
        if (!isValid) throw new ApiError(401, "Invalid credentials");

        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        // Persist refreshToken + lastLogin
        admin.refreshToken = refreshToken;
        admin.lastLogin = new Date();
        await admin.save({ validateBeforeSave: false });

        const safeAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(new ApiResponse(200, { user: { ...safeAdmin.toObject(), role: admin.role }, accessToken }, "Logged in as admin"));
    }

    // 2. Check User collection
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "No account found with this email");
    if (!user.isActive) throw new ApiError(403, "Account is deactivated");

    if (user.authProvider === "google") {
        throw new ApiError(400, "This account uses Google Sign-In. Please use Google login.");
    }

    const isValid = await user.isPasswordCorrect(password);
    if (!isValid) throw new ApiError(401, "Invalid credentials");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const safeUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { user: { ...safeUser.toObject(), role: "user" }, accessToken }, "Logged in successfully"));
});

// ─── GOOGLE LOGIN (users only) ────────────────────────────────────────────────
const googleLogin = asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) throw new ApiError(400, "Google token is required");

    try {
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const { name, email } = ticket.getPayload();

        // Block admin emails from using Google login
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
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(new ApiResponse(200, { user: { ...safeUser.toObject(), role: "user" }, accessToken }, "Logged in via Google"));
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(401, "Invalid Google token");
    }
});

// ─── GET PROFILE ──────────────────────────────────────────────────────────────
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is set by verifyJWT middleware (works for both User and Admin)
    return res.status(200).json(
        new ApiResponse(200, req.user, "Profile fetched successfully")
    );
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
const logoutUser = asyncHandler(async (req, res) => {
    // Clear refreshToken in DB for the logged-in entity
    if (req.user?.model === "Admin") {
        await Admin.findByIdAndUpdate(req.user._id, { refreshToken: null }, { new: true });
    } else {
        await User.findByIdAndUpdate(req.user._id, { refreshToken: null }, { new: true });
    }

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export { registerUser, loginUser, getUserProfile, googleLogin, logoutUser };
