import express from 'express';
import { registerCustomer, loginCustomer, getMyProfile, updateMyProfile, updatePassword } from '../controllers/customerController.js';
import { protectCustomer } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.get('/profile', protectCustomer, getMyProfile);
router.put('/profile', protectCustomer, updateMyProfile);
router.put('/password', protectCustomer, updatePassword);

export default router;
