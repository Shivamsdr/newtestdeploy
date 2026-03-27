import express from 'express';
import { getPublicAvailabilityForTour } from '../controllers/availability.controller.js';

const router = express.Router();

// Public endpoint for customer booking date options
router.get('/:tourId', getPublicAvailabilityForTour);

export default router;

