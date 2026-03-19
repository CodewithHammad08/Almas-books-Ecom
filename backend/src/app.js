import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import authRouter from './routes/auth.routes.js'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'
import orderRouter from './routes/order.routes.js'
import printRouter from './routes/print.routes.js'
import categoryRouter from './routes/category.routes.js'
import contactRouter from './routes/contact.routes.js'
import testimonialRouter from './routes/testimonial.routes.js'
import wishlistRouter from './routes/wishlist.routes.js'
import reviewRouter from './routes/review.routes.js'
import paymentRouter from './routes/payment.routes.js'

// routes declaration
app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/orders", orderRouter)
app.use("/api/print-request", printRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/contact", contactRouter)
app.use("/api/testimonials", testimonialRouter)
app.use("/api/wishlist", wishlistRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/payments", paymentRouter)

app.get('/', (req, res) => {
    res.send("Almas Books Backend server is running!");
});

// Global error handler — must be defined AFTER routes
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || []
    });
});

export { app }
