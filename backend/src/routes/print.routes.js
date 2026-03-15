import { Router } from "express";
import { submitPrintRequest, getAllPrintRequests, updatePrintRequestStatus } from "../controllers/print.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").post(upload.single("document"), submitPrintRequest)
                 .get(verifyJWT, isAdmin, getAllPrintRequests);
                   
router.route("/:id/status").put(verifyJWT, isAdmin, updatePrintRequestStatus);

export default router;
