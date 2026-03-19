import { Router } from "express";
import { getPaymentQR, confirmPayment, downloadInvoice } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/qr/:orderId").get(getPaymentQR);
router.route("/confirm").post(confirmPayment);
router.route("/invoice/:orderId").get(downloadInvoice);

export default router;
