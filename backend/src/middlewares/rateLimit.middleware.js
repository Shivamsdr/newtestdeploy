import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/AppError.js';

// Higher limits for development, stricter for production
const isDev = process.env.NODE_ENV !== 'production';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 100, // Higher limit for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    next(
      new AppError(
        'Too many requests from this IP, please try again later.',
        429
      )
    );
  },
});
