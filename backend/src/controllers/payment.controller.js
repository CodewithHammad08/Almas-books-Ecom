import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { generateUPIUri, generateQRDataURL } from "../utils/qr.utils.js";
import { generateInvoicePDF } from "../utils/invoice.utils.js";
import { STORE_UPI_ID, STORE_NAME } from "../constant.js";
import { isAdminRole } from "../middlewares/auth.middleware.js";

// ── Get Payment QR ────────────────────────────────────────────────────────────
const getPaymentQR = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) throw new ApiError(404, "Order not found");

    // ✅ Ownership check (admin can also view for support)
    const ownsOrder = order.user.toString() === req.user._id.toString();
    if (!ownsOrder && !isAdminRole(req.user)) {
        throw new ApiError(403, "Unauthorized access to order");
    }

    if (order.paymentStatus === "paid") {
        throw new ApiError(400, "Order is already paid");
    }

    const upiUri = generateUPIUri({
        vpa: STORE_UPI_ID,
        name: STORE_NAME,
        amount: order.totalPrice.toFixed(2),
        orderRef: order._id.toString().slice(-6).toUpperCase(),
        note: `Payment for Order #${order._id.toString().slice(-6)}`
    });

    const qrDataUrl = await generateQRDataURL(upiUri);

    return res.status(200).json(new ApiResponse(200, { qrDataUrl, upiUri }, "QR generated successfully"));
});

// ── Confirm Payment ───────────────────────────────────────────────────────────
const confirmPayment = asyncHandler(async (req, res) => {
    // ✅ Type-check inputs
    const { orderId, transactionId } = req.body;

    if (typeof orderId !== "string" || typeof transactionId !== "string") {
        throw new ApiError(400, "Order ID and Transaction ID must be strings");
    }
    if (!orderId.trim() || !transactionId.trim()) {
        throw new ApiError(400, "Order ID and Transaction ID are required");
    }

    const order = await Order.findById(orderId.trim());
    if (!order) throw new ApiError(404, "Order not found");

    // ✅ Ownership check — prevents IDOR (any user confirming any order)
    if (order.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to confirm this order");
    }

    // ✅ Idempotency guard — prevent double-confirmation / state corruption
    if (order.paymentStatus === "paid") {
        return res.status(200).json(new ApiResponse(200, order, "Order is already confirmed"));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 🔒 PRODUCTION NOTE: In a live system, verify transactionId with your
    //    payment gateway (e.g. Razorpay orders.fetch / Stripe charge.retrieve)
    //    before marking as paid. Example:
    //
    //    const payment = await razorpay.payments.fetch(transactionId);
    //    if (payment.status !== "captured" || payment.amount !== order.totalPrice * 100) {
    //        throw new ApiError(400, "Payment verification failed");
    //    }
    // ─────────────────────────────────────────────────────────────────────────

    order.paymentStatus = "paid";
    order.transactionId = transactionId.trim();
    order.orderStatus = "confirmed";
    await order.save();

    return res.status(200).json(new ApiResponse(200, order, "Payment confirmed successfully"));
});

// ── Download Invoice ──────────────────────────────────────────────────────────
const downloadInvoice = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) throw new ApiError(404, "Order not found");

    // ✅ Fixed: use isAdminRole for consistent superadmin + admin check
    const ownsOrder = order.user.toString() === req.user._id.toString();
    if (!ownsOrder && !isAdminRole(req.user)) {
        throw new ApiError(403, "Unauthorized access to invoice");
    }

    if (order.paymentStatus !== "paid") {
        throw new ApiError(400, "Invoice is only available for paid orders");
    }

    const pdfBuffer = await generateInvoicePDF(order, req.user);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="invoice_${order._id.toString().slice(-6)}.pdf"`
    );

    return res.status(200).send(pdfBuffer);
});

export { getPaymentQR, confirmPayment, downloadInvoice };
