import { Router } from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getCart);
router.route("/add").post(addToCart);
router.route("/remove").delete(removeFromCart);

export default router;
