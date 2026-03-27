import express from 'express';
import {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteCompletedEnquiries,
} from '../controllers/enquiry.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', createEnquiry);
router.get('/', protect, getAllEnquiries);
router.patch('/:id/status', protect, updateEnquiryStatus);
router.delete('/completed', protect, deleteCompletedEnquiries);

export default router;
