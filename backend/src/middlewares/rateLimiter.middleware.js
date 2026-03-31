import rateLimit from "express-rate-limit";

// ── Global Limiter — 200 req / 15 min ─────────────────────────────────────────
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "production" ? 200 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests. Please try again later." }
});

// ── Strict Limiter — 10 req / 15 min (auth & payment endpoints) ───────────────
export const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "production" ? 15 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many attempts. Please try again in 15 minutes." }
});
