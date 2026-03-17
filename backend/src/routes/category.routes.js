import { Router } from "express";
import { getCategories, createCategory, deleteCategory } from "../controllers/category.controller.js";
import { verifyJWT, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/")
    .get(getCategories)
    .post(verifyJWT, requireAdmin, createCategory);

router.route("/:id")
    .delete(verifyJWT, requireAdmin, deleteCategory);

export default router;
