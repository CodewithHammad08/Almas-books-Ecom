import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";

// ── Helper: check if req.user is a valid admin/superadmin ────────────────────
export const isAdminRole = (user) =>
    user?.model === "Admin" && ["admin", "superadmin"].includes(user?.role);

// ── verifyJWT ─────────────────────────────────────────────────────────────────
export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized — no token provided");
    }

    let decoded;
    try {
        // ✅ Enforce HS256 — prevents "alg:none" and RS256 confusion attacks
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
            algorithms: ["HS256"]
        });
    } catch {
        // Single generic message — don't reveal expiry vs invalid distinction
        throw new ApiError(401, "Invalid or expired token");
    }

    // ✅ Always hydrate entity from DB — token claims are only trusted for routing,
    //    not for final authorization decisions.
    let entity;
    if (decoded.model === "Admin") {
        entity = await Admin.findById(decoded._id).select("-password -refreshToken");
        if (!entity) throw new ApiError(401, "Unauthorized");
        if (!entity.isActive) throw new ApiError(403, "Account is deactivated");
        req.user = { ...entity.toObject(), model: "Admin" };
    } else {
        entity = await User.findById(decoded._id).select("-password -refreshToken");
        if (!entity) throw new ApiError(401, "Unauthorized");
        if (!entity.isActive) throw new ApiError(403, "Account is deactivated");
        req.user = { ...entity.toObject(), role: "user", model: "User" };
    }

    next();
});

// ── requireAdmin — single source of truth for admin-only routes ──────────────
export const requireAdmin = asyncHandler(async (req, res, next) => {
    if (!isAdminRole(req.user)) {
        throw new ApiError(403, "Access denied — admins only");
    }
    next();
});

// ── requireSuperAdmin ─────────────────────────────────────────────────────────
export const requireSuperAdmin = asyncHandler(async (req, res, next) => {
    if (req.user?.model !== "Admin" || req.user?.role !== "superadmin") {
        throw new ApiError(403, "Access denied — superadmins only");
    }
    next();
});
