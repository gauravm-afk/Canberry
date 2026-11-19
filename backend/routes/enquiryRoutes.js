import express from 'express';
import { createEnquiry, getEnquiries } from '../controllers/enquiryController.js';
import { protectCustomer } from '../middleware/auth.js';

const router = express.Router();

// Only authenticated customers can submit enquiries
router.post('/', protectCustomer, createEnquiry);
router.get('/', getEnquiries);

export default router;
