import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  createBooking,
  createOfflineBooking,
  getAvailability,
  getAvailabilityRange,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/booking.controller.js';

const router = express.Router();

router.get('/availability', getAvailability);
router.get('/availability/range', getAvailabilityRange);
router.post('/', createBooking);

// Admin: create a full offline booking (not linked to website)
router.post('/offline', protect, createOfflineBooking);

// Public route to get booking by ID (for viewing own booking confirmation)
router.get('/:id', getBookingById);

// Admin routes
router.get('/', protect, getAllBookings);
router.patch('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

export default router;
