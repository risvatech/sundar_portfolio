import { db } from '../db/sql.js';
import { galleryCategories, galleryItems } from '../db/schema.js';
import { eq, desc, asc, like, and, or, sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { uploadDir } from '../middlewares/galleiesImg.js';

// Helper function to get full image URL
const getFullImageUrl = (req, filename) => {
    return `${req.protocol}://${req.get('host')}/api/uploads/gallery/${filename}`;
};

// Helper function to delete image files
const deleteImageFiles = (filenames) => {
    if (Array.isArray(filenames)) {
        filenames.forEach(filename => {
            if (filename) {
                const filePath = path.join(uploadDir, path.basename(filename));
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        });
    } else if (filenames) {
        const filePath = path.join(uploadDir, path.basename(filenames));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

// Extract filename from URL
const extractFilename = (url) => {
    return url ? url.split('/').pop() : null;
};

// Parse JSON array safely
const parseImageUrls = (imageUrls) => {
    if (!imageUrls) return [];
    if (Array.isArray(imageUrls)) return imageUrls;
    try {
        return JSON.parse(imageUrls) || [];
    } catch (error) {
        return [];
    }
};

// ==================== CATEGORY CONTROLLERS ====================

export const categoryController = {
    // Create Category
    createCategory: async (req, res) => {
        try {
            const { name, description, isActive = true } = req.body;

            // Check if category name already exists
            const existingCategory = await db
                .select()
                .from(galleryCategories)
                .where(eq(galleryCategories.name, name))
                .limit(1);

            if (existingCategory.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Category name already exists'
                });
            }

            const [category] = await db
                .insert(galleryCategories)
                .values({
                    name,
                    description,
                    isActive
                })
                .returning();

            res.status(201).json({
                success: true,
                data: category
            });
        } catch (error) {
            console.error('Create category error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create category'
            });
        }
    },

    // Get All Categories
    getAllCategories: async (req, res) => {
        try {
            const { isActive, sort = 'name', order = 'asc' } = req.query;

            let whereClause;
            if (isActive !== undefined) {
                whereClause = eq(galleryCategories.isActive, isActive === 'true');
            }

            const orderBy = order === 'desc' ? desc(galleryCategories[sort]) : asc(galleryCategories[sort]);

            const categories = await db
                .select()
                .from(galleryCategories)
                .where(whereClause)
                .orderBy(orderBy);

            res.json({
                success: true,
                data: categories
            });
        } catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch categories'
            });
        }
    },

    // Get Category by ID
    getCategoryById: async (req, res) => {
        try {
            const { id } = req.params;

            const [category] = await db
                .select()
                .from(galleryCategories)
                .where(eq(galleryCategories.id, parseInt(id)));

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }

            res.json({
                success: true,
                data: category
            });
        } catch (error) {
            console.error('Get category error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch category'
            });
        }
    },

    // Update Category
    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, isActive } = req.body;

            // Check if category exists
            const [existingCategory] = await db
                .select()
                .from(galleryCategories)
                .where(eq(galleryCategories.id, parseInt(id)));

            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }

            // If name is being updated, check if new name already exists
            if (name && name !== existingCategory.name) {
                const categoryWithName = await db
                    .select()
                    .from(galleryCategories)
                    .where(and(
                        eq(galleryCategories.name, name),
                        sql`id != ${parseInt(id)}`
                    ))
                    .limit(1);

                if (categoryWithName.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Category name already exists'
                    });
                }
            }

            const updateData = {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(isActive !== undefined && { isActive }),
                updatedAt: new Date()
            };

            const [updatedCategory] = await db
                .update(galleryCategories)
                .set(updateData)
                .where(eq(galleryCategories.id, parseInt(id)))
                .returning();

            res.json({
                success: true,
                data: updatedCategory
            });
        } catch (error) {
            console.error('Update category error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update category'
            });
        }
    },

    // Delete Category
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;

            // Check if category exists
            const [existingCategory] = await db
                .select()
                .from(galleryCategories)
                .where(eq(galleryCategories.id, parseInt(id)));

            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }

            // Check if category has gallery items
            const galleryItemsInCategory = await db
                .select()
                .from(galleryItems)
                .where(eq(galleryItems.categoryId, parseInt(id)))
                .limit(1);

            if (galleryItemsInCategory.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete category with gallery items'
                });
            }

            await db
                .delete(galleryCategories)
                .where(eq(galleryCategories.id, parseInt(id)));

            res.json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error) {
            console.error('Delete category error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete category'
            });
        }
    }
};

// ==================== GALLERY CONTROLLERS ====================

export const galleryController = {
    // Create Gallery Item with Multiple Images
    createGalleryItem: async (req, res) => {
        try {
            const {
                title,
                description,
                categoryId,
                isActive = true,
                sortOrder = 0,
                thumbnailIndex = 0
            } = req.body;

            // Check if files were uploaded
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one image file is required'
                });
            }

            // If categoryId is provided, verify it exists
            if (categoryId) {
                const [category] = await db
                    .select()
                    .from(galleryCategories)
                    .where(eq(galleryCategories.id, parseInt(categoryId)));

                if (!category) {
                    deleteImageFiles(req.files.map(file => file.filename));
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid category ID'
                    });
                }
            }

            // Convert thumbnailIndex to number
            const thumbIndex = parseInt(thumbnailIndex) || 0;

            // Construct image URLs
            const imageUrls = req.files.map(file => getFullImageUrl(req, file.filename));

            // Select thumbnail (default to first image)
            const thumbnailUrl = imageUrls[thumbIndex] || imageUrls[0];

            const [galleryItem] = await db
                .insert(galleryItems)
                .values({
                    title,
                    description,
                    thumbnailUrl,
                    imageUrls: JSON.stringify(imageUrls),
                    categoryId: categoryId ? parseInt(categoryId) : null,
                    isActive: isActive === 'true' || isActive === true,
                    sortOrder: parseInt(sortOrder) || 0
                })
                .returning();

            // Parse imageUrls back to array for response
            const responseData = {
                ...galleryItem,
                imageUrls: parseImageUrls(galleryItem.imageUrls)
            };

            res.status(201).json({
                success: true,
                data: responseData
            });
        } catch (error) {
            if (req.files) {
                deleteImageFiles(req.files.map(file => file.filename));
            }
            console.error('Create gallery item error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create gallery item'
            });
        }
    },

    // Get All Gallery Items
    getAllGalleryItems: async (req, res) => {
        try {
            const {
                categoryId,
                isActive,
                search,
                sort = 'createdAt',
                order = 'desc',
                page = 1,
                limit = 10
            } = req.query;

            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            const offset = (pageNum - 1) * limitNum;

            // Build where clause
            const conditions = [];

            if (categoryId) {
                conditions.push(eq(galleryItems.categoryId, parseInt(categoryId)));
            }

            if (isActive !== undefined) {
                conditions.push(eq(galleryItems.isActive, isActive === 'true'));
            }

            if (search) {
                conditions.push(
                    or(
                        like(galleryItems.title, `%${search}%`),
                        like(galleryItems.description, `%${search}%`)
                    )
                );
            }

            const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

            // Get total count
            const countResult = await db
                .select({ count: sql`count(*)` })
                .from(galleryItems)
                .where(whereClause);

            const total = parseInt(countResult[0].count);

            // Get paginated data
            const orderBy = order === 'desc' ? desc(galleryItems[sort]) : asc(galleryItems[sort]);

            const items = await db
                .select()
                .from(galleryItems)
                .where(whereClause)
                .orderBy(orderBy)
                .limit(limitNum)
                .offset(offset);

            // Parse imageUrls for each item
            const itemsWithParsedUrls = items.map(item => ({
                ...item,
                imageUrls: parseImageUrls(item.imageUrls)
            }));

            res.json({
                success: true,
                data: itemsWithParsedUrls,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            });
        } catch (error) {
            console.error('Get gallery items error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch gallery items'
            });
        }
    },

    // Get Gallery Item by ID
    getGalleryItemById: async (req, res) => {
        try {
            const { id } = req.params;

            const [item] = await db
                .select()
                .from(galleryItems)
                .where(eq(galleryItems.id, parseInt(id)));

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Gallery item not found'
                });
            }

            // Get category info if categoryId exists
            let category = null;
            if (item.categoryId) {
                const [cat] = await db
                    .select()
                    .from(galleryCategories)
                    .where(eq(galleryCategories.id, item.categoryId));
                category = cat;
            }

            const responseData = {
                ...item,
                imageUrls: parseImageUrls(item.imageUrls),
                category
            };

            res.json({
                success: true,
                data: responseData
            });
        } catch (error) {
            console.error('Get gallery item error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch gallery item'
            });
        }
    },

    // Update Gallery Item
    updateGalleryItem: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                title,
                description,
                categoryId,
                isActive,
                sortOrder,
                thumbnailIndex,
                removeImages
            } = req.body;
            const newFiles = req.files || [];

            // Check if gallery item exists
            const [existingItem] = await db
                .select()
                .from(galleryItems)
                .where(eq(galleryItems.id, parseInt(id)));

            if (!existingItem) {
                deleteImageFiles(newFiles.map(file => file.filename));
                return res.status(404).json({
                    success: false,
                    message: 'Gallery item not found'
                });
            }

            // If categoryId is provided, verify it exists
            if (categoryId) {
                const [category] = await db
                    .select()
                    .from(galleryCategories)
                    .where(eq(galleryCategories.id, parseInt(categoryId)));

                if (!category) {
                    deleteImageFiles(newFiles.map(file => file.filename));
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid category ID'
                    });
                }
            }

            // Parse existing image URLs
            const existingImageUrls = parseImageUrls(existingItem.imageUrls);

            // Handle image removal
            let updatedImageUrls = [...existingImageUrls];
            if (removeImages) {
                const imagesToRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
                imagesToRemove.forEach(imageUrl => {
                    const filename = extractFilename(imageUrl);
                    deleteImageFiles(filename);
                    updatedImageUrls = updatedImageUrls.filter(url => url !== imageUrl);
                });
            }

            // Add new images
            const newImageUrls = newFiles.map(file => getFullImageUrl(req, file.filename));
            updatedImageUrls = [...updatedImageUrls, ...newImageUrls];

            // Update thumbnail
            let thumbnailUrl = existingItem.thumbnailUrl;
            if (thumbnailIndex !== undefined && updatedImageUrls.length > 0) {
                const thumbIndex = parseInt(thumbnailIndex) || 0;
                thumbnailUrl = updatedImageUrls[thumbIndex] || updatedImageUrls[0];
            } else if (newImageUrls.length > 0 && !thumbnailUrl) {
                thumbnailUrl = newImageUrls[0];
            }

            // Prepare update data
            const updateData = {
                updatedAt: new Date()
            };

            if (title !== undefined) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (categoryId !== undefined) updateData.categoryId = categoryId ? parseInt(categoryId) : null;
            if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
            if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder) || 0;

            updateData.imageUrls = JSON.stringify(updatedImageUrls);
            updateData.thumbnailUrl = thumbnailUrl;

            const [updatedItem] = await db
                .update(galleryItems)
                .set(updateData)
                .where(eq(galleryItems.id, parseInt(id)))
                .returning();

            const responseData = {
                ...updatedItem,
                imageUrls: parseImageUrls(updatedItem.imageUrls)
            };

            res.json({
                success: true,
                data: responseData
            });
        } catch (error) {
            if (req.files) {
                deleteImageFiles(req.files.map(file => file.filename));
            }
            console.error('Update gallery item error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update gallery item'
            });
        }
    },

    // Delete Gallery Item
    deleteGalleryItem: async (req, res) => {
        try {
            const { id } = req.params;

            const [existingItem] = await db
                .select()
                .from(galleryItems)
                .where(eq(galleryItems.id, parseInt(id)));

            if (!existingItem) {
                return res.status(404).json({
                    success: false,
                    message: 'Gallery item not found'
                });
            }

            // Delete all associated image files
            const imageUrls = parseImageUrls(existingItem.imageUrls);
            const thumbnailUrl = existingItem.thumbnailUrl;

            const allUrls = [...imageUrls, thumbnailUrl].filter(Boolean);
            const filenames = allUrls.map(url => extractFilename(url));
            deleteImageFiles(filenames);

            await db
                .delete(galleryItems)
                .where(eq(galleryItems.id, parseInt(id)));

            res.json({
                success: true,
                message: 'Gallery item deleted successfully'
            });
        } catch (error) {
            console.error('Delete gallery item error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete gallery item'
            });
        }
    },

    // Get Gallery Items by Category
    getGalleryItemsByCategory: async (req, res) => {
        try {
            const { categoryId } = req.params;
            const { isActive, sort = 'sortOrder', order = 'asc' } = req.query;

            // Check if category exists
            const [category] = await db
                .select()
                .from(galleryCategories)
                .where(eq(galleryCategories.id, parseInt(categoryId)));

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }

            let whereClause = eq(galleryItems.categoryId, parseInt(categoryId));

            if (isActive !== undefined) {
                whereClause = and(
                    whereClause,
                    eq(galleryItems.isActive, isActive === 'true')
                );
            }

            const orderBy = order === 'desc' ? desc(galleryItems[sort]) : asc(galleryItems[sort]);

            const items = await db
                .select()
                .from(galleryItems)
                .where(whereClause)
                .orderBy(orderBy);

            const itemsWithParsedUrls = items.map(item => ({
                ...item,
                imageUrls: parseImageUrls(item.imageUrls)
            }));

            res.json({
                success: true,
                data: itemsWithParsedUrls
            });
        } catch (error) {
            console.error('Get gallery items by category error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch gallery items'
            });
        }
    }
};