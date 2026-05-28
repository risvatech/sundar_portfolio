import express from "express";
import { upload } from "../middlewares/CoverImg.js";
import {
    getAllPosts,
    getPostById,
    checkSlug,
    createPost,
    updatePost,
    deletePost,
    getPostBySlug,
    getPublishedPosts,        // ✅ Add this import
    getPublishedPostBySlug,   // ✅ Add this import
    updatePostStatus,         // ✅ Add this import
} from "../controllers/postsController.js";

const router = express.Router();

// ✅ Add separate image upload endpoint
router.post("/upload", upload.single("coverImage"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Return the file URL that frontend expects
    const fileUrl = `${req.protocol}://${req.get("host")}/api/uploads/posts/${req.file.filename}`;
    res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename
    });
});

// CRUD routes
router.get("/", getAllPosts);
router.get("/published", getPublishedPosts);  // ✅ Add this route - IMPORTANT!
router.get("/published/:slug", getPublishedPostBySlug);  // ✅ Add this route
router.get("/check-slug/:slug", checkSlug);
router.get("/slug/:slug", getPostBySlug);
router.get("/:id", getPostById);

// Create and update
router.post("/", createPost);
router.put("/:id", updatePost);
router.patch("/:id/status", updatePostStatus);  // ✅ Add status update route

// Delete
router.delete("/:id", deletePost);

export default router;