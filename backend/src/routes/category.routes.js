import { Router } from "express";
import { getCategories, createCategory } from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/").get(getCategories)
    .post(verifyJWT, isAdmin, createCategory);

export default router;
