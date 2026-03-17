import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        // Sanitize filename: replace spaces/special chars to avoid upload path issues
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9_-]/g, "_")
            .slice(0, 50); // limit length
        const unique = `${base}_${Date.now()}${ext}`;
        cb(null, unique);
    }
});

// File filter - accept common document + image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}. Use PDF, DOC, DOCX, JPG, or PNG.`), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
});
