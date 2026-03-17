import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Document types that must use resource_type "raw" on Cloudinary
const RAW_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ".xlsx", ".xls", ".ppt", ".pptx", ".txt", ".csv"]);

/**
 * Inject fl_inline into a Cloudinary raw URL so the browser views the file
 * instead of downloading it. Transforms:
 *   .../raw/upload/v123/...  →  .../raw/upload/fl_inline/v123/...
 */
const makeInlineUrl = (url) => {
    if (!url) return url;
    return url.replace(/\/upload\/(?!fl_inline)/, "/upload/fl_inline/");
};

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;

    // Configure INSIDE the function so dotenv env vars are guaranteed loaded
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const ext = path.extname(localFilePath).toLowerCase();
    const resourceType = RAW_EXTENSIONS.has(ext) ? "raw" : "auto";

    const cleanup = () => { try { fs.unlinkSync(localFilePath); } catch {} };

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType,
            folder: "almas-print-requests",
            use_filename: true,
            unique_filename: true,
        });
        cleanup();

        // Return with inline-viewable secure URL
        return {
            ...response,
            secure_url: makeInlineUrl(response.secure_url),
            url: makeInlineUrl(response.secure_url), // always https
        };

    } catch (error) {
        console.error(`❌ Cloudinary upload failed [${resourceType}]:`, error?.message || error);

        // Fallback: if "auto" failed, retry with "raw"
        if (resourceType === "auto") {
            try {
                const response = await cloudinary.uploader.upload(localFilePath, {
                    resource_type: "raw",
                    folder: "almas-print-requests",
                    use_filename: true,
                    unique_filename: true,
                });
                cleanup();
                return {
                    ...response,
                    secure_url: makeInlineUrl(response.secure_url),
                    url: makeInlineUrl(response.secure_url),
                };
            } catch (retryErr) {
                console.error("❌ Cloudinary raw retry failed:", retryErr?.message || retryErr);
            }
        }
        cleanup();
        return null;
    }
};

export { uploadOnCloudinary };
