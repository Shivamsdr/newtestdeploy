import asyncHandler from 'express-async-handler';
import TimelineStep from '../models/TimelineStep.js';
import { AppError } from '../utils/AppError.js';

export const getTimelineStepsByTour = asyncHandler(async (req, res) => {
  const { tourId } = req.params;

  const steps = await TimelineStep.find({ tour: tourId })
    .sort({ order: 1 })
    .lean();

  res.status(200).json({
    status: 'success',
    data: {
      steps,
    },
  });
});

export const getAllTimelineSteps = asyncHandler(async (req, res) => {
  const steps = await TimelineStep.find()
    .populate('tour', 'name slug')
    .sort({ tour: 1, order: 1 })
    .lean();

  res.status(200).json({
    status: 'success',
    data: {
      steps,
    },
  });
});

export const getTimelineStepById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const step = await TimelineStep.findById(id).populate('tour', 'name slug');

  if (!step) {
    return next(new AppError('No timeline step found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      step,
    },
  });
});

export const createTimelineStep = asyncHandler(async (req, res) => {
  const step = await TimelineStep.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      step,
    },
  });
});

export const updateTimelineStep = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const step = await TimelineStep.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!step) {
    return next(new AppError('No timeline step found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      step,
    },
  });
});

export const deleteTimelineStep = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const step = await TimelineStep.findByIdAndDelete(id);

  if (!step) {
    return next(new AppError('No timeline step found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const reorderTimelineSteps = asyncHandler(async (req, res, next) => {
  const { tourId } = req.params;
  const { steps } = req.body; // Array of { id, order }

  if (!Array.isArray(steps)) {
    return next(new AppError('Steps must be an array', 400));
  }

  const bulkOps = steps.map(({ id, order }) => ({
    updateOne: {
      filter: { _id: id, tour: tourId },
      update: { order },
    },
  }));

  await TimelineStep.bulkWrite(bulkOps);

  const updatedSteps = await TimelineStep.find({ tour: tourId })
    .sort({ order: 1 })
    .lean();

  res.status(200).json({
    status: 'success',
    data: {
      steps: updatedSteps,
    },
  });
});
