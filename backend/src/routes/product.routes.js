import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getProducts)
    .post(verifyJWT, isAdmin, upload.single("image"), createProduct);

router.route("/:id").get(getProductById)
    .put(verifyJWT, isAdmin, upload.single("image"), updateProduct)
    .delete(verifyJWT, isAdmin, deleteProduct);

export default router;
