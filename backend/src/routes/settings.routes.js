import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getSettings, getPublicSettings, updateSettings } from '../controllers/settings.controller.js';

const router = express.Router();

// Public subset for homepage trust section
router.get('/public', getPublicSettings);

// All other settings routes require authentication
router.get('/', protect, getSettings);
router.patch('/', protect, updateSettings);

export default router;
