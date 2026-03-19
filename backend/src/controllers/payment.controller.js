import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { generateUPIUri, generateQRDataURL } from "../utils/qr.utils.js";
import { generateInvoicePDF } from "../utils/invoice.utils.js";
import { STORE_UPI_ID, STORE_NAME } from "../constant.js";

/**
 * Generate a QR Code for Payment
 * GET /api/v1/payments/qr/:orderId
 */
const getPaymentQR = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorised access to order");
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

/**
 * Confirm Payment (Simulated)
 * POST /api/v1/payments/confirm
 */
const confirmPayment = asyncHandler(async (req, res) => {
    const { orderId, transactionId } = req.body;

    if (!orderId || !transactionId) {
        throw new ApiError(400, "Order ID and Transaction ID are required");
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.paymentStatus = "paid";
    order.transactionId = transactionId;
    order.orderStatus = "confirmed";
    await order.save();

    return res.status(200).json(new ApiResponse(200, order, "Payment confirmed successfully"));
});

/**
 * Download Invoice
 * GET /api/v1/payments/invoice/:orderId
 */
const downloadInvoice = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "Unauthorised access to invoice");
    }

    if (order.paymentStatus !== "paid") {
        throw new ApiError(400, "Invoice is only available for paid orders");
    }

    const pdfBuffer = await generateInvoicePDF(order, req.user);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${order._id.toString().slice(-6)}.pdf`);
    
    return res.status(200).send(pdfBuffer);
});

export {
    getPaymentQR,
    confirmPayment,
    downloadInvoice
};
