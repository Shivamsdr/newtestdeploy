import asyncHandler from 'express-async-handler';
import CorporateCard from '../models/CorporateCard.js';
import { AppError } from '../utils/AppError.js';

export const getAllCorporateCards = asyncHandler(async (req, res) => {
    const { active } = req.query;
    const filter = active === 'true' ? { isActive: true } : {};

    const corporateCards = await CorporateCard.find(filter)
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({
        status: 'success',
        data: { corporateCards },
    });
});

export const getCorporateCardById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const corporateCard = await CorporateCard.findById(id);

    if (!corporateCard) {
        return next(new AppError('No corporate card found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { corporateCard },
    });
});

export const createCorporateCard = asyncHandler(async (req, res) => {
    const corporateCard = await CorporateCard.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { corporateCard },
    });
});

export const updateCorporateCard = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const corporateCard = await CorporateCard.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!corporateCard) {
        return next(new AppError('No corporate card found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { corporateCard },
    });
});

export const deleteCorporateCard = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const corporateCard = await CorporateCard.findByIdAndDelete(id);

    if (!corporateCard) {
        return next(new AppError('No corporate card found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
