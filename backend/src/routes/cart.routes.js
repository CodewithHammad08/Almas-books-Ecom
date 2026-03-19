import { Router } from "express";
import { getCart, addToCart, removeFromCart, syncCart } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getCart);
router.route("/add").post(addToCart);
router.route("/remove").delete(removeFromCart);
router.route("/sync").put(syncCart);

export default router;
