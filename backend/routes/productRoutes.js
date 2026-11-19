import express from 'express';
import { getProducts, getProductById, seedProducts, createProduct, updateProduct, deleteProduct, toggleProductStatus } from '../controllers/productController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/seed', seedProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protectAdmin, createProduct);
router.put('/:id/status', protectAdmin, toggleProductStatus);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
