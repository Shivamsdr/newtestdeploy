import asyncHandler from 'express-async-handler';
import Testimonial from '../models/Testimonial.js';
import { AppError } from '../utils/AppError.js';

export const getAllTestimonials = asyncHandler(async (req, res) => {
  const { active } = req.query;
  
  const filter = active === 'true' ? { isActive: true } : {};
  
  const testimonials = await Testimonial.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    status: 'success',
    data: {
      testimonials,
    },
  });
});

export const getTestimonialById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findById(id);

  if (!testimonial) {
    return next(new AppError('No testimonial found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      testimonial,
    },
  });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      testimonial,
    },
  });
});

export const updateTestimonial = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!testimonial) {
    return next(new AppError('No testimonial found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      testimonial,
    },
  });
});

export const deleteTestimonial = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findByIdAndDelete(id);

  if (!testimonial) {
    return next(new AppError('No testimonial found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
