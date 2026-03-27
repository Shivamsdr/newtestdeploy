import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Please provide username and password', 400));
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return next(new AppError('Admin credentials not configured', 500));
  }

  if (username !== adminUsername) {
    return next(new AppError('Incorrect username or password', 401));
  }

  // Compare password directly since it's stored as plain text in .env
  // For production, consider hashing the password and using bcrypt.compare()
  const isPasswordValid = password === adminPassword;

  if (!isPasswordValid) {
    return next(new AppError('Incorrect username or password', 401));
  }

  const token = signToken(adminUsername);

  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});
