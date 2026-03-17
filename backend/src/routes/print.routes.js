import { Router } from "express";
import { submitPrintRequest, getAllPrintRequests, updatePrintRequestStatus } from "../controllers/print.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import multer from "multer";

const router = Router();

// Wrap upload to catch multer-specific errors (file type, size, etc.)
const uploadWithErrorHandling = (req, res, next) => {
    upload.single("document")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, statusCode: 400, message: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ success: false, statusCode: 400, message: err.message || "File upload failed" });
        }
        next();
    });
};

router.route("/")
    .post(uploadWithErrorHandling, submitPrintRequest)
    .get(verifyJWT, isAdmin, getAllPrintRequests);

router.route("/:id/status").put(verifyJWT, isAdmin, updatePrintRequestStatus);

export default router;
