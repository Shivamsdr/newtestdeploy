import asyncHandler from 'express-async-handler';
import Blog from '../models/Blog.js';
import { AppError } from '../utils/AppError.js';

export const getAllBlogs = asyncHandler(async (req, res) => {
  const { published } = req.query;
  const filter = published === 'true' ? { isPublished: true } : {};

  const blogs = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    status: 'success',
    data: { blogs },
  });
});

export const getBlogById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);

  if (!blog) {
    return next(new AppError('No blog post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { blog },
  });
});

export const getBlogBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const blog = await Blog.findOne({ slug, isPublished: true });

  if (!blog) {
    return next(new AppError('No blog post found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { blog },
  });
});

export const createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { blog },
  });
});

export const updateBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return next(new AppError('No blog post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { blog },
  });
});

export const deleteBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    return next(new AppError('No blog post found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
