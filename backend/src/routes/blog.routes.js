import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlogById);

// Protected routes (admin only)
router.post('/', protect, createBlog);
router.patch('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;
