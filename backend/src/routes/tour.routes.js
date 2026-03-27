import express from 'express';
import {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getTourAvailabilityAdmin,
  setTourAvailabilityTimesAdmin,
} from '../controllers/tour.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllTours);
router.get('/:id', getTourById);

// Protected routes (admin only)
router.post('/', protect, createTour);
router.patch('/:id', protect, updateTour);
router.delete('/:id', protect, deleteTour);

// Admin: tour availability (next 3 months) with times
router.get('/:id/availability', protect, getTourAvailabilityAdmin);
router.put('/:id/availability/:date', protect, setTourAvailabilityTimesAdmin);

export default router;
