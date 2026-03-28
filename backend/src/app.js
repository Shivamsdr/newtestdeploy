import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';

import { AppError } from './utils/AppError.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { apiLimiter } from './middlewares/rateLimit.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import tourRoutes from './routes/tour.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import enquiryRoutes from './routes/enquiry.routes.js';
import timelineRoutes from './routes/timeline.routes.js';
import statsRoutes from './routes/stats.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import blogRoutes from './routes/blog.routes.js';
import jobRoutes from './routes/job.routes.js';
import availabilityRoutes from './routes/availability.routes.js';
import corporateCardRoutes from './routes/corporateCard.routes.js';
import { connectDB } from './config/db.js';

const app = express();

// Ensure DB connection is established before routing requests in serverless environments
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Trust proxy (important for production behind reverse proxy like Railway)
app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Webhook raw body parser MUST be defined before global express.json()
app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));

// Global Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

/* ================= CORS FIX ================= */

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',')
  : [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow Postman/curl

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/* ================= CACHING FIX ================= */
// Prevents the frontend from re-loading static data every single time a page opens
app.use((req, res, next) => {
  const publicPaths = ['/api/v1/tours', '/api/v1/blogs', '/api/v1/testimonials', '/api/v1/timeline', '/api/v1/jobs', '/api/v1/settings/public'];
  const isPublic = publicPaths.some(p => req.path.startsWith(p));
  const isAuth = req.headers.authorization;

  if (req.method === 'GET' && isPublic && !isAuth) {
    // Cache GET response heavily for PUBLIC users only
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  } else {
    // Admin or private/auth requests should ALWAYS get fresh data
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});
/* =========================================== */

// Rate limiting
//app.use('/api/v1', apiLimiter);

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/enquiries', enquiryRoutes);
app.use('/api/v1/timeline', timelineRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/availability', availabilityRoutes);
app.use('/api/v1/corporate-cards', corporateCardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
