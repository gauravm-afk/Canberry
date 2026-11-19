import express from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController.js';
import { protectCustomer, protectAnyUser } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/', protectCustomer, createOrder);
router.get('/my', protectCustomer, getMyOrders);
router.get('/:id', protectAnyUser, getOrderById);

export default router;
