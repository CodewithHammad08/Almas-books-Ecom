import { Router } from "express";
import { getPaymentQR, confirmPayment, downloadInvoice } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { strictLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/qr/:orderId", getPaymentQR);
router.post("/confirm", strictLimiter, confirmPayment); // ✅ rate limited
router.get("/invoice/:orderId", downloadInvoice);

export default router;
