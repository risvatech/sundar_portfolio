import multer from "multer";
import fs from "fs";
import path from "path";

/* ============================================================
   🔹 Ensure uploads/gallery directory exists
   ============================================================ */
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

export const uploadDir = path.resolve("./uploads/gallery");
ensureDir(uploadDir);

/* ============================================================
   🔹 Multer setup for multiple files
   ============================================================ */
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("❌ Only image files are allowed!"), false);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max per file
        files: 10 // Maximum 10 files
    },
});

// For single file upload (thumbnail)
export const uploadSingle = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
}).single('thumbnail');

// For multiple files
export const uploadMultiple = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10
    }
}).array('images', 10); // Maximum 10 images