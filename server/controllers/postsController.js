// controllers/postsController.js
import { db } from "../db/sql.js";
import { posts } from "../db/schema.js";
import { eq, desc, and, not, sql } from "drizzle-orm";
import { deleteFile } from "../middlewares/CoverImg.js";

// Helper function to parse tags from JSON string to array (with error handling)
const parsePostTags = (post) => {
    if (!post) return post;

    let parsedTags = [];
    if (post.tags) {
        try {
            // Try to parse as JSON
            parsedTags = JSON.parse(post.tags);
            // Ensure it's an array
            if (!Array.isArray(parsedTags)) {
                parsedTags = [];
            }
        } catch (e) {
            // If JSON parsing fails, try to handle as comma-separated string or clean up malformed data
            console.warn(`Failed to parse tags for post ${post.id}:`, post.tags);

            if (typeof post.tags === 'string') {
                // Remove any malformed JSON artifacts (like {, }, etc.)
                let cleanTags = post.tags
                    .replace(/[{}"\[\]]/g, '') // Remove { } [ ] "
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0);

                parsedTags = cleanTags;
            } else if (Array.isArray(post.tags)) {
                parsedTags = post.tags;
            }
        }
    }

    return {
        ...post,
        tags: parsedTags
    };
};

const parsePostsTags = (postsArray) => {
    return postsArray.map(post => parsePostTags(post));
};

// Helper function to stringify tags for database storage
const stringifyTags = (tags) => {
    if (!tags) return null;
    if (typeof tags === 'string') {
        // Check if it's already valid JSON
        try {
            const parsed = JSON.parse(tags);
            if (Array.isArray(parsed)) {
                return tags; // Already valid JSON
            }
        } catch (e) {
            // Not valid JSON, treat as comma-separated string
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            return JSON.stringify(tagsArray);
        }
    } else if (Array.isArray(tags)) {
        // If it's already an array, stringify it
        return JSON.stringify(tags);
    }
    return null;
};

// Trigger sitemap update function
const triggerSitemapUpdate = async () => {
    try {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const secret = process.env.REVALIDATION_SECRET || 'fd9e864ffc391c7a0cc417357918d811a61eeee04afb3300081d4da1ce652b46';

        console.log(`🔄 Triggering sitemap update to: ${frontendUrl}/revalidate?tag=sitemap`);

        const response = await fetch(`${frontendUrl}/revalidate?tag=sitemap`, {
            method: 'POST',
            headers: {
                'x-revalidate-secret': secret,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('✅ Sitemap update triggered successfully');
        } else {
            const errorText = await response.text();
            console.log('⚠️ Sitemap update failed with status:', response.status, errorText);
        }
    } catch (error) {
        console.log('⚠️ Sitemap update webhook failed:', error.message);
    }
};

// GET all posts (with optional category filter)
export const getAllPosts = async (req, res) => {
    try {
        const { categoryId } = req.query;

        let query = db.select().from(posts).orderBy(desc(posts.createdAt));

        // Filter by category if provided
        if (categoryId) {
            query = query.where(eq(posts.categoryId, Number(categoryId)));
        }

        const allPosts = await query;
        const postsWithParsedTags = parsePostsTags(allPosts);

        res.json({ success: true, posts: postsWithParsedTags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch posts" });
    }
};

// GET post by ID
export const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const [post] = await db.select().from(posts).where(eq(posts.id, Number(id)));
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        const postWithParsedTags = parsePostTags(post);
        res.json({ success: true, post: postWithParsedTags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// CHECK slug availability
export const checkSlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const existing = await db.select().from(posts).where(eq(posts.slug, slug));
        res.json({ success: true, available: existing.length === 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// CREATE post
export const createPost = async (req, res) => {
    const {
        title,
        slug,
        excerpt,
        content,
        status,
        coverImage,
        description,
        tags,
        metaTitle,
        metaKeywords,
        metaDescription,
        categoryId,
        publishDate
    } = req.body;

    if (!title || !slug || !content) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const existing = await db.select().from(posts).where(eq(posts.slug, slug));
        if (existing.length) {
            return res.status(400).json({ success: false, message: "Slug already exists" });
        }

        let coverImageUrl = coverImage || null;

        // If coverImage is a relative path, prepend host
        if (coverImageUrl && coverImageUrl.startsWith("/api/uploads/posts/")) {
            coverImageUrl = `${req.protocol}://${req.get("host")}${coverImageUrl}`;
        }

        // Process tags - convert to JSON string for storage
        const processedTags = stringifyTags(tags);

        const [newPost] = await db.insert(posts).values({
            title,
            slug,
            excerpt: excerpt || "",
            content,
            status: status || "draft",
            coverImage: coverImageUrl,
            description: description || "",
            tags: processedTags,
            metaTitle: metaTitle || "",
            metaKeywords: metaKeywords || "",
            metaDescription: metaDescription || "",
            categoryId: categoryId ? Number(categoryId) : null,
            publishDate: publishDate ? new Date(publishDate) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        await triggerSitemapUpdate();

        const postWithParsedTags = parsePostTags(newPost);
        res.status(201).json({ success: true, post: postWithParsedTags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// UPDATE post
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const {
        title,
        slug,
        excerpt,
        content,
        status,
        description,
        tags,
        metaTitle,
        metaKeywords,
        metaDescription,
        categoryId,
        publishDate
    } = req.body;

    if (!title || !slug || !content) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        // Check if post exists
        const [existingPost] = await db.select().from(posts).where(eq(posts.id, Number(id)));
        if (!existingPost) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Check slug uniqueness
        if (slug !== existingPost.slug) {
            const existingSlug = await db
                .select()
                .from(posts)
                .where(and(eq(posts.slug, slug), not(eq(posts.id, Number(id)))));
            if (existingSlug.length) {
                return res.status(400).json({ success: false, message: "Slug already exists" });
            }
        }

        let coverImageUrl = existingPost.coverImage;

        // Handle new file upload
        if (req.file) {
            // Delete old file if exists
            if (existingPost.coverImage) {
                deleteFile(existingPost.coverImage);
            }

            // Construct full URL for new file
            coverImageUrl = `${req.protocol}://${req.get("host")}/api/coveruploads/${req.file.filename}`;
        } else if (req.body.coverImage) {
            // If body has coverImage (relative path), prepend host if needed
            coverImageUrl = req.body.coverImage.startsWith("http")
                ? req.body.coverImage
                : `${req.protocol}://${req.get("host")}${req.body.coverImage}`;
        }

        // Process tags - convert to JSON string for storage
        let processedTags = existingPost.tags;
        if (tags !== undefined) {
            processedTags = stringifyTags(tags);
        }

        // Update post
        const [updatedPost] = await db
            .update(posts)
            .set({
                title,
                slug,
                excerpt: excerpt || "",
                content,
                status: status || "draft",
                coverImage: coverImageUrl,
                description: description !== undefined ? description : existingPost.description,
                tags: processedTags,
                metaTitle: metaTitle !== undefined ? metaTitle : existingPost.metaTitle,
                metaKeywords: metaKeywords !== undefined ? metaKeywords : existingPost.metaKeywords,
                metaDescription: metaDescription !== undefined ? metaDescription : existingPost.metaDescription,
                categoryId: categoryId !== undefined ? (categoryId ? Number(categoryId) : null) : existingPost.categoryId,
                publishDate: publishDate !== undefined ? (publishDate ? new Date(publishDate) : null) : existingPost.publishDate,
                updatedAt: new Date(),
            })
            .where(eq(posts.id, Number(id)))
            .returning();

        await triggerSitemapUpdate();

        const postWithParsedTags = parsePostTags(updatedPost);
        res.status(200).json({ success: true, post: postWithParsedTags });
    } catch (err) {
        console.error("Error updating post:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// DELETE post
export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const [deleted] = await db.delete(posts).where(eq(posts.id, Number(id))).returning();
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Delete associated cover image file
        if (deleted.coverImage) {
            deleteFile(deleted.coverImage);
        }

        await triggerSitemapUpdate();

        res.json({ success: true, message: "Post deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET post by slug
export const getPostBySlug = async (req, res) => {
    const { slug } = req.params;

    try {
        const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        // prepend host to coverImage if needed
        if (post.coverImage?.startsWith("/api/uploads/posts/")) {
            post.coverImage = `${req.protocol}://${req.get("host")}${post.coverImage}`;
        }

        const postWithParsedTags = parsePostTags(post);
        res.json({ success: true, post: postWithParsedTags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// SEARCH posts by title or content
export const searchPosts = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ success: false, message: "Search query is required" });
    }

    try {
        const searchResults = await db
            .select()
            .from(posts)
            .where(
                sql`${posts.title} ILIKE ${'%' + q + '%'} OR ${posts.content} ILIKE ${'%' + q + '%'}`
            )
            .orderBy(desc(posts.createdAt));

        const postsWithParsedTags = parsePostsTags(searchResults);
        res.json({ success: true, posts: postsWithParsedTags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET posts by tag
export const getPostsByTag = async (req, res) => {
    const { tag } = req.params;

    try {
        // Search within JSON array for the tag
        const taggedPosts = await db
            .select()
            .from(posts)
            .where(sql`${posts.tags}::text ILIKE ${'%' + tag + '%'}`)
            .orderBy(desc(posts.createdAt));

        const postsWithParsedTags = parsePostsTags(taggedPosts);
        res.json({ success: true, posts: postsWithParsedTags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET posts by category
export const getPostsByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const categoryPosts = await db
            .select()
            .from(posts)
            .where(eq(posts.categoryId, Number(categoryId)))
            .orderBy(desc(posts.createdAt));

        const postsWithParsedTags = parsePostsTags(categoryPosts);
        res.json({ success: true, posts: postsWithParsedTags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET published posts (for frontend)
export const getPublishedPosts = async (req, res) => {
    try {
        const { categoryId, limit } = req.query;

        let query = db
            .select()
            .from(posts)
            .where(eq(posts.status, "published"))
            .orderBy(desc(posts.publishDate), desc(posts.createdAt));

        if (categoryId) {
            query = query.where(eq(posts.categoryId, Number(categoryId)));
        }

        if (limit) {
            query = query.limit(Number(limit));
        }

        const publishedPosts = await query;
        const postsWithParsedTags = parsePostsTags(publishedPosts);

        res.json({ success: true, posts: postsWithParsedTags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch published posts" });
    }
};

// GET single published post by slug (for frontend)
export const getPublishedPostBySlug = async (req, res) => {
    const { slug } = req.params;

    try {
        const [post] = await db
            .select()
            .from(posts)
            .where(and(eq(posts.slug, slug), eq(posts.status, "published")));

        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        // prepend host to coverImage if needed
        if (post.coverImage?.startsWith("/api/uploads/posts/")) {
            post.coverImage = `${req.protocol}://${req.get("host")}${post.coverImage}`;
        }

        const postWithParsedTags = parsePostTags(post);
        res.json({ success: true, post: postWithParsedTags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// UPDATE post status (publish/unpublish)
export const updatePostStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["draft", "published"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
    }

    try {
        const [existingPost] = await db.select().from(posts).where(eq(posts.id, Number(id)));
        if (!existingPost) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const [updatedPost] = await db
            .update(posts)
            .set({
                status,
                publishDate: status === "published" ? new Date() : existingPost.publishDate,
                updatedAt: new Date(),
            })
            .where(eq(posts.id, Number(id)))
            .returning();

        await triggerSitemapUpdate();

        const postWithParsedTags = parsePostTags(updatedPost);
        res.json({ success: true, post: postWithParsedTags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Optional: Clean up malformed tags in database
export const cleanupMalformedTags = async (req, res) => {
    try {
        const allPosts = await db.select().from(posts);
        let cleanedCount = 0;

        for (const post of allPosts) {
            if (post.tags && typeof post.tags === 'string') {
                try {
                    // Try to parse as JSON
                    JSON.parse(post.tags);
                } catch (e) {
                    // Malformed JSON, clean it up
                    console.log(`Cleaning malformed tags for post ${post.id}:`, post.tags);

                    // Extract clean tags using regex
                    const tagMatches = post.tags.match(/"([^"]+)"/g) || post.tags.match(/([a-zA-Z][a-zA-Z0-9]+)/g);
                    let cleanTags = [];

                    if (tagMatches) {
                        cleanTags = tagMatches
                            .map(tag => tag.replace(/"/g, '').trim())
                            .filter(tag => tag.length > 0 && !tag.includes('{') && !tag.includes('}'));
                    }

                    const cleanTagsJson = JSON.stringify(cleanTags);

                    await db.update(posts)
                        .set({ tags: cleanTagsJson })
                        .where(eq(posts.id, post.id));

                    cleanedCount++;
                }
            }
        }

        res.json({
            success: true,
            message: `Cleaned up ${cleanedCount} posts with malformed tags`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};