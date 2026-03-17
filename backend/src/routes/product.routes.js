import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { verifyJWT, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// / — GET public, POST admin-only
router.route("/")
    .get(getProducts)
    .post(verifyJWT, requireAdmin, createProduct);

// /:id — GET public, PUT/DELETE admin-only
router.route("/:id")
    .get(getProductById)
    .put(verifyJWT, requireAdmin, updateProduct)
    .delete(verifyJWT, requireAdmin, deleteProduct);

export default router;
