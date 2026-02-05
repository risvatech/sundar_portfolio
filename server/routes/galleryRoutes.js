import express from 'express';
import { categoryController, galleryController } from '../controllers/galleryController.js';
import { uploadMultiple } from '../middlewares/galleiesImg.js';

const router = express.Router();

// ==================== CATEGORY ROUTES ====================

// Create category
router.post('/categories', categoryController.createCategory);

// Get all categories
router.get('/categories', categoryController.getAllCategories);

// Get category by ID
router.get('/categories/:id', categoryController.getCategoryById);

// Update category
router.put('/categories/:id', categoryController.updateCategory);
router.patch('/categories/:id', categoryController.updateCategory);

// Delete category
router.delete('/categories/:id', categoryController.deleteCategory);

// ==================== GALLERY ITEM ROUTES ====================

// Create gallery item with multiple file upload
router.post('/', uploadMultiple, galleryController.createGalleryItem);

// Get all gallery items with pagination and filters
router.get('/', galleryController.getAllGalleryItems);

// Get gallery item by ID
router.get('/:id', galleryController.getGalleryItemById);

// Update gallery item with optional multiple file upload
router.put('/:id', uploadMultiple, galleryController.updateGalleryItem);
router.patch('/:id', uploadMultiple, galleryController.updateGalleryItem);

// Delete gallery item
router.delete('/:id', galleryController.deleteGalleryItem);

// Get gallery items by category
router.get('/categories/:categoryId/gallery', galleryController.getGalleryItemsByCategory);

export default router;