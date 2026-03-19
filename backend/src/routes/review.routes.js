import { Router } from "express";
import { addReview, getProductReviews } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/product/:productId").get(getProductReviews);
router.route("/").post(verifyJWT, addReview);

export default router;
