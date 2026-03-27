import express from 'express';
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/job.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected (admin only)
router.post('/', protect, createJob);
router.patch('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

export default router;
