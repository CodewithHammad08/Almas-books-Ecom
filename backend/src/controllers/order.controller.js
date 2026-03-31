import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isAdminRole } from "../middlewares/auth.middleware.js";

const SHIPPING_FEE = 50;
const ALLOWED_PAYMENT_METHODS = ["COD", "QR", "Card"];

// ── Create Order ──────────────────────────────────────────────────────────────
const createOrder = asyncHandler(async (req, res) => {
    // ✅ Whitelist only the fields we need — no mass assignment
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        throw new ApiError(400, "No order items found");
    }

    if (!shippingAddress || !paymentMethod) {
        throw new ApiError(400, "Shipping address and payment method are required");
    }

    // ✅ Validate paymentMethod against explicit allowlist
    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
        throw new ApiError(400, `Invalid payment method. Allowed: ${ALLOWED_PAYMENT_METHODS.join(", ")}`);
    }

    // ✅ Compute totalPrice server-side — never trust client-supplied price
    let computedTotal = 0;
    const enrichedItems = [];

    for (const item of items) {
        // ✅ Validate item structure
        if (!item.product || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) {
            throw new ApiError(400, "Invalid item format — product and quantity are required");
        }

        const product = await Product.findById(item.product);
        if (!product) {
            throw new ApiError(404, `Product not found: ${item.product}`);
        }
        if (!product.isActive) {
            throw new ApiError(400, `Product is no longer available: ${product.name}`);
        }
        if (product.stock < Number(item.quantity)) {
            throw new ApiError(400, `Not enough stock for: ${product.name}`);
        }

        // Decrement stock
        product.stock -= Number(item.quantity);
        await product.save();

        // ✅ Use DB price — never req.body item.price
        computedTotal += product.price * Number(item.quantity);

        enrichedItems.push({
            product: product._id,
            productName: product.name,
            productImage: product.images?.[0]?.url || product.image || "",
            quantity: Number(item.quantity),
            price: product.price  // ✅ authoritative server price
        });
    }

    computedTotal += SHIPPING_FEE;

    // ✅ Explicit construction — no spread of req.body
    const order = await Order.create({
        user: req.user._id,         // ✅ from JWT, not body
        items: enrichedItems,
        totalPrice: computedTotal,  // ✅ server-computed
        shippingAddress,
        paymentMethod,
        orderStatus: "pending",     // ✅ hardcoded initial state
        paymentStatus: "unpaid"     // ✅ hardcoded initial state
    });

    // Fire-and-forget order confirmation email
    import("../services/email.service.js").then(({ sendOrderConfirmation }) => {
        sendOrderConfirmation(req.user, order).catch(err =>
            console.error("Email failed:", err)
        );
    }).catch(() => {});

    return res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
});

// ── Get Current User's Orders ─────────────────────────────────────────────────
const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate("items.product", "name price image")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// ── Get Single Order by ID ────────────────────────────────────────────────────
const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id).populate("items.product", "name price image");
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // ✅ Fixed: accept both "admin" AND "superadmin" roles using isAdminRole helper
    const ownsOrder = order.user.toString() === req.user._id.toString();
    if (!ownsOrder && !isAdminRole(req.user)) {
        throw new ApiError(403, "Not authorized to view this order");
    }

    return res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

// ── Admin: Get All Orders ─────────────────────────────────────────────────────
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate("user", "name email")
        .populate("items.product", "name price")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

// ── Admin: Update Order Status ────────────────────────────────────────────────
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // ✅ Whitelist only 'status' from body — no mass assignment
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Allowed: ${validStatuses.join(", ")}`);
    }

    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.orderStatus = status;
    await order.save();

    return res.status(200).json(new ApiResponse(200, order, "Order status updated"));
});

export {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};
