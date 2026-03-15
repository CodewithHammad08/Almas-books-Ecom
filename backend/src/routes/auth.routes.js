import { Router } from "express";
import { registerUser, loginUser, getUserProfile, googleLogin } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/google").post(googleLogin);
router.route("/profile").get(verifyJWT, getUserProfile);

export default router;
