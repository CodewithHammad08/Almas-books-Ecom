import { Router } from "express";
import { submitContact } from "../controllers/contact.controller.js";

const router = Router();

router.route("/").post(submitContact);

export default router;
