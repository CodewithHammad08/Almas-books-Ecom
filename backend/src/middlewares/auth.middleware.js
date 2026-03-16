import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized — no token provided");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        let entity;

        // Check which model this token belongs to
        if (decoded.model === "Admin") {
            entity = await Admin.findById(decoded._id).select("-password -refreshToken");
            if (!entity) throw new ApiError(401, "Admin not found");
            if (!entity.isActive) throw new ApiError(403, "Admin account is deactivated");
            req.user = { ...entity.toObject(), role: entity.role, model: "Admin" };
        } else {
            entity = await User.findById(decoded._id).select("-password -refreshToken");
            if (!entity) throw new ApiError(401, "User not found");
            if (!entity.isActive) throw new ApiError(403, "Account is deactivated");
            req.user = { ...entity.toObject(), role: "user", model: "User" };
        }

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid or expired token");
    }
});

// Middleware to restrict access to admins only
export const requireAdmin = asyncHandler(async (req, res, next) => {
    if (req.user?.model !== "Admin") {
        throw new ApiError(403, "Access denied — admins only");
    }
    next();
});

// Middleware to restrict access to superadmins only
export const requireSuperAdmin = asyncHandler(async (req, res, next) => {
    if (req.user?.role !== "superadmin") {
        throw new ApiError(403, "Access denied — superadmins only");
    }
    next();
});
