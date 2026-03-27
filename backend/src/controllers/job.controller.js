import asyncHandler from 'express-async-handler';
import Job from '../models/Job.js';
import { AppError } from '../utils/AppError.js';

export const getAllJobs = asyncHandler(async (req, res) => {
  const { published } = req.query;
  const filter = published === 'true' ? { isPublished: true } : {};

  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    status: 'success',
    data: { jobs },
  });
});

export const getJobById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) {
    return next(new AppError('No job found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { job },
  });
});

export const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { job },
  });
});

export const updateJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    return next(new AppError('No job found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { job },
  });
});

export const deleteJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findByIdAndDelete(id);

  if (!job) {
    return next(new AppError('No job found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
