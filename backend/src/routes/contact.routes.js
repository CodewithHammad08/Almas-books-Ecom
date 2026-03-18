import { Router } from "express";
import { submitContact, getTestimonials } from "../controllers/contact.controller.js";

const router = Router();

router.route("/").post(submitContact);
router.route("/testimonials").get(getTestimonials);

export default router;
