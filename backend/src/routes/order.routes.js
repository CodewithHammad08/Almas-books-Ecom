import { Router } from "express";
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(verifyJWT);

// User routes
router.route("/").post(createOrder)
                 .get(getUserOrders);

router.route("/:id").get(getOrderById);

// Admin routes
router.route("/all/orders").get(isAdmin, getAllOrders);
router.route("/:id/status").put(isAdmin, updateOrderStatus);

export default router;
