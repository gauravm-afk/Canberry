import express from 'express';
import { loginAdmin, getDashboardStats, getAllCustomers, deleteCustomer } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/auth.js';
import { getAllOrders, updateOrderStatus, updatePaymentStatus } from '../controllers/orderController.js';
import { getEnquiries, updateEnquiryStatus } from '../controllers/enquiryController.js';
import { createProduct, updateProduct, deleteProduct, toggleProductStatus } from '../controllers/productController.js';

const router = express.Router();

// Auth
router.post('/login', loginAdmin);

// Dashboard
router.get('/dashboard', protectAdmin, getDashboardStats);

// Customers
router.get('/customers', protectAdmin, getAllCustomers);
router.delete('/customers/:id', protectAdmin, deleteCustomer);

// Products
router.post('/products', protectAdmin, createProduct);
router.put('/products/:id', protectAdmin, updateProduct);
router.delete('/products/:id', protectAdmin, deleteProduct);
router.put('/products/:id/status', protectAdmin, toggleProductStatus);

// Orders
router.get('/orders', protectAdmin, getAllOrders);
router.put('/orders/:id/status', protectAdmin, updateOrderStatus);
router.put('/orders/:id/payment', protectAdmin, updatePaymentStatus);

// Enquiries
router.get('/enquiries', protectAdmin, getEnquiries);
router.put('/enquiries/:id/status', protectAdmin, updateEnquiryStatus);

export default router;
