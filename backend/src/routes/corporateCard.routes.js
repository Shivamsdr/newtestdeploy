import express from 'express';
import {
    getAllCorporateCards,
    getCorporateCardById,
    createCorporateCard,
    updateCorporateCard,
    deleteCorporateCard,
} from '../controllers/corporateCard.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCorporateCards);
router.get('/:id', getCorporateCardById);

// Protected routes (admin only)
router.post('/', protect, createCorporateCard);
router.patch('/:id', protect, updateCorporateCard);
router.delete('/:id', protect, deleteCorporateCard);

export default router;
