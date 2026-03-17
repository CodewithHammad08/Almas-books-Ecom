import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createOrder = asyncHandler(async (req, res) => {
    const { items, totalPrice, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
        throw new ApiError(400, "No order items found");
    }

    if (!shippingAddress || !paymentMethod) {
        throw new ApiError(400, "Shipping address and payment method are required");
    }

    // Process each item to check stock, decrement stock, and build snapshots
    const enrichedItems = [];
    for (const item of items) {
        const product = await Product.findById(item.product);
        
        if (!product) {
            throw new ApiError(404, `Product not found: ${item.product}`);
        }
        
        if (product.stock < item.quantity) {
            throw new ApiError(400, `Not enough stock for product: ${product.name}`);
        }
        
        // Decrement stock
        product.stock -= item.quantity;
        await product.save();

        // Build snapshot so order record is self-contained
        enrichedItems.push({
            product: product._id,
            productName: product.name,
            productImage: product.images?.[0]?.url || product.image || "",
            quantity: item.quantity,
            price: item.price
        });
    }

    const order = await Order.create({
        user: req.user._id,
        items: enrichedItems,
        totalPrice,
        shippingAddress,
        paymentMethod,
        orderStatus: "pending"
    });

    return res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
});

const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate("items.product", "name price image");
    
    return res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const order = await Order.findById(id).populate("items.product", "name price image");
    
    if (!order) {
        throw new ApiError(404, "Order not found");
    }
    
    // Check if user is the creator of the order or an admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "Not authorized to view this order");
    }

    return res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

// Admin Route to get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name email").populate("items.product", "name price");
    return res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

// Admin Route to update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid order status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.orderStatus = status;
    await order.save();

    return res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
});

export {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};
