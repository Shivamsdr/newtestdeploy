import express from 'express';
import {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonial.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllTestimonials);
router.get('/:id', getTestimonialById);

// Protected routes (admin only)
router.post('/', protect, createTestimonial);
router.patch('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

export default router;
