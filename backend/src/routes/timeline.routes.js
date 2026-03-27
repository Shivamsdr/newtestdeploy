import express from 'express';
import {
  getAllTimelineSteps,
  getTimelineStepsByTour,
  getTimelineStepById,
  createTimelineStep,
  updateTimelineStep,
  deleteTimelineStep,
  reorderTimelineSteps,
} from '../controllers/timeline.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllTimelineSteps);
router.get('/tour/:tourId', getTimelineStepsByTour);
router.get('/:id', getTimelineStepById);

// Protected routes (admin only)
router.post('/', protect, createTimelineStep);
router.patch('/:id', protect, updateTimelineStep);
router.delete('/:id', protect, deleteTimelineStep);
router.put('/tour/:tourId/reorder', protect, reorderTimelineSteps);

export default router;
