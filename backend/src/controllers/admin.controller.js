import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

// Admin: Get dashboard stats
const getAdminStats = asyncHandler(async (req, res) => {
    const [totalUsers, totalProducts, allOrders] = await Promise.all([
        User.countDocuments({ isActive: true }),
        Product.countDocuments({}),
        Order.find({})
    ]);

    const totalRevenue = allOrders
        .filter(o => o.orderStatus !== "cancelled")
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const pendingOrders = allOrders.filter(o => o.orderStatus === "pending").length;
    const totalOrders = allOrders.length;

    return res.status(200).json(new ApiResponse(200, {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue
    }, "Stats fetched successfully"));
});

export { getAdminStats };
