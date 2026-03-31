import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { globalLimiter } from "./middlewares/rateLimiter.middleware.js";

const app = express();

// ── Trust proxy (set to 1 if behind Nginx/load balancer, false otherwise) ──
app.set("trust proxy", false);

// ── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
            scriptSrc: ["'self'"],
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ── CORS — explicit multi-origin allowlist ───────────────────────────────────
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = (process.env.CORS_ORIGIN || "")
            .split(",")
            .map(o => o.trim())
            .filter(Boolean);

        // Allow server-to-server requests (no origin) and whitelisted origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin '${origin}' not allowed`));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ── NoSQL Injection Prevention ───────────────────────────────────────────────
// NOTE: express-mongo-sanitize tries to overwrite req.query which is a read-only
// getter in Express v5. We limit it to only req.body and params to avoid the crash.
app.use((req, res, next) => {
    try {
        mongoSanitize.sanitize(req.body, { allowDots: false });
        mongoSanitize.sanitize(req.params, { allowDots: false });
    } catch (e) {
        // silently ignore sanitization errors — don't crash the app
    }
    next();
});

// ── HTTP Parameter Pollution Prevention ─────────────────────────────────────
app.use(hpp());

app.use(globalLimiter);

// ── Routes ───────────────────────────────────────────────────────────────────
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import printRouter from "./routes/print.routes.js";
import categoryRouter from "./routes/category.routes.js";
import contactRouter from "./routes/contact.routes.js";
import testimonialRouter from "./routes/testimonial.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import reviewRouter from "./routes/review.routes.js";
import paymentRouter from "./routes/payment.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/print-request", printRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/contact", contactRouter);
app.use("/api/testimonials", testimonialRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/payments", paymentRouter);

app.get("/", (req, res) => {
    res.json({ success: true, message: "Almas Books API is running." });
});

// ── Debug Route (Temporary) ─────────────────────────────────────────────────
import { Admin } from "./models/admin.model.js";
import { User } from "./models/user.model.js";
app.get("/api/debug-users", async (req, res) => {
    try {
        const admins = await Admin.find();
        const specificAdmin = await Admin.findOne({ email: "hammaddalvi905@gmail.com" });
        const users = await User.find().select('email password isActive authProvider');
        res.status(200).json({ admins, specificAdmin, users });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ── Seed Admins (Temporary) ─────────────────────────────────────────────────
app.get("/api/seed-admins", async (req, res) => {
    try {
        const ADMINS = [
            {
                name: "Hammad",
                email: "hammaddalvi905@gmail.com",
                password: "Hammad@2006",
                role: "superadmin",
                phone: ""
            },
            {
                name: "Owner",
                email: "zubair36@gmail.com",
                password: "password123",
                role: "admin",
                phone: ""
            }
        ];

        const results = [];
        for (const data of ADMINS) {
            const existing = await Admin.findOne({ email: data.email });
            if (existing) {
                results.push(`Already exists: ${data.email}`);
                continue;
            }
            await Admin.create(data);
            results.push(`Created: ${data.email}`);
        }
        res.status(200).json({ success: true, results });
    } catch (e) {
        res.status(500).json({ success: false, error: e.stack || e.message });
    }
});

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found." });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    const isDev = process.env.NODE_ENV === "development";
    const statusCode = err.statusCode || 500;

    // Never leak internal 5xx details to clients in production
    const message = statusCode < 500
        ? err.message
        : isDev ? err.message : "An internal error occurred.";

    if (statusCode >= 500) {
        console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);
    }

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(isDev && statusCode >= 500 && { stack: err.stack }),
        errors: err.errors || []
    });
});

export { app };

