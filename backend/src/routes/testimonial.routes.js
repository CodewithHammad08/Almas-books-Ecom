import { Router } from "express";
import { submitTestimonial, getTestimonials } from "../controllers/testimonial.controller.js";

const router = Router();

router.route("/").post(submitTestimonial).get(getTestimonials);

export default router;
