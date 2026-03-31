import { Router } from "express";
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    getUserProfile,
    googleLogin,
    logoutUser,
    updateUserAddress
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { strictLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// ── Rate-limited public routes ─────────────────────────────────────────────
router.post("/register", strictLimiter, registerUser);
router.post("/login", strictLimiter, loginUser);
router.post("/google", strictLimiter, googleLogin);
router.post("/refresh", strictLimiter, refreshAccessToken);

// ── Protected routes ───────────────────────────────────────────────────────
router.get("/profile", verifyJWT, getUserProfile);
router.post("/logout", verifyJWT, logoutUser);
router.put("/address", verifyJWT, updateUserAddress);

export default router;
