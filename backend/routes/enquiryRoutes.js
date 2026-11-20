import express from 'express';
import { createEnquiry, getEnquiries, getMyEnquiries } from '../controllers/enquiryController.js';
import { protectCustomer } from '../middleware/auth.js';

const router = express.Router();

// Only authenticated customers can submit or view their enquiries
router.post('/', protectCustomer, createEnquiry);
router.get('/my', protectCustomer, getMyEnquiries);
router.get('/', getEnquiries);

export default router;
