import { Router } from "express";
import { toggleWishlist, getWishlist } from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getWishlist);
router.route("/toggle").post(toggleWishlist);

export default router;
