import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';
import { AppError } from '../utils/AppError.js';
import {
  checkAvailability,
  reserveSlots,
  releaseSlots,
  getAvailabilityForRange,
} from '../services/availability.service.js';
import TourAvailability from '../models/TourAvailability.js';
import { sendEmail } from '../utils/email.js';

/** Parse date as UTC start-of-day. Handles "YYYY-MM-DD" from body/query explicitly. */
const startOfDayUTC = (d) => {
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.trim())) {
    return new Date(d.trim() + 'T00:00:00.000Z');
  }
  const dt = new Date(d);
  return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
};

// Simple normalizer for times[] (HH:mm), kept in sync with availability.service.js behaviour
const normalizeTimesList = (times) => {
  if (!Array.isArray(times)) return [];
  const cleaned = times
    .filter((t) => typeof t === 'string')
    .map((t) => t.trim())
    .filter((t) => t && /^\d{2}:\d{2}$/.test(t));
  const unique = Array.from(new Set(cleaned));
  unique.sort();
  return unique;
};

/** Add N months in UTC while staying at start-of-day. */
const addMonthsUTC = (date, months) => {
  const d = startOfDayUTC(date);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
};

/**
 * POST /api/v1/bookings
 * Input: tourId, bookingDate, peopleCount
 * 1. Validate input
 * 2. Check availability (via atomic reserve)
 * 3. Create booking with status = pending
 * 4. bookedSlots incremented atomically inside reserveSlots (step 2)
 */
export const createBooking = asyncHandler(async (req, res, next) => {
  // Check if bookings are globally enabled
  const Settings = (await import('../models/Settings.js')).default;
  const settings = await Settings.getSettings();
  if (!settings.bookingsEnabled) {
    return next(new AppError('Bookings are currently unavailable. Please try again later.', 503));
  }

  const {
    tourId,
    bookingDate: rawDate,
    peopleCount,
    bookingTime,
    bookingType,
    customerName,
    customerAge,
    customerGender,
    customerEmail,
    customerPhone,
    customerAddress,
  } = req.body;

  if (!tourId || rawDate == null || peopleCount == null) {
    return next(new AppError('Missing required fields: tourId, bookingDate, peopleCount', 400));
  }

  const tour = await Tour.findById(tourId).lean();
  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  const bookingDate = startOfDayUTC(rawDate);
  const today = startOfDayUTC(new Date());
  const maxEnd = addMonthsUTC(today, 3);
  if (bookingDate < today) {
    return next(new AppError('Booking date must be today or a future date', 400));
  }
  if (bookingDate > maxEnd) {
    return next(new AppError('Booking date must be within the next 3 months', 400));
  }

  const count = Number(peopleCount);
  if (count < 1 || count > (tour.maxGroupSize || 50)) {
    return next(new AppError(`People count must be between 1 and ${tour.maxGroupSize}`, 400));
  }

  // Ensure the selected date exists in TourAvailability and is active,
  // and that it still has remaining slots > 0.
  const explicit = await TourAvailability.findOne({
    tourId,
    date: bookingDate,
    $or: [{ isActive: { $exists: false } }, { isActive: true }],
  }).lean();

  if (!explicit) {
    return next(new AppError('Selected date is not available for this tour', 400));
  }

  const remainingFromDoc = Math.max(
    0,
    (explicit.totalSlots ?? 0) - (explicit.bookedSlots ?? 0)
  );
  if (remainingFromDoc <= 0) {
    return next(
      new AppError(
        'Selected date is fully booked. Please choose another date.',
        400
      )
    );
  }

  // Double-check availability before reserving (prevents race conditions)
  const availability = await checkAvailability(tourId, bookingDate);
  if (availability.remainingSlots < count) {
    return next(
      new AppError(
        `Insufficient availability. Only ${availability.remainingSlots} slot(s) available, but ${count} requested.`,
        400
      )
    );
  }

  await reserveSlots(tourId, bookingDate, count);

  const type = bookingType === 'private' ? 'private' : 'group';
  const booking = await Booking.create({
    tourId,
    bookingDate,
    bookingTime: bookingTime || undefined,
    peopleCount: count,
    bookingType: type,
    status: 'pending', // Starts as pending, admin can change to paid
    totalAmount: (tour.price || 0) * count,
    customerName,
    customerAge: customerAge ? Number(customerAge) : undefined,
    customerGender,
    customerEmail,
    customerPhone,
    customerAddress,
  });

  // Send confirmation emails immediately (Must await in serverless environments before res.json)
  try {
    const adminEmail = process.env.EMAIL_USER;
    const tourName = tour.name || 'our tour';
    const dateStr = bookingDate.toLocaleDateString();

    // 1. Email to Customer
    if (customerEmail) {
      await sendEmail({
        to: customerEmail,
        subject: `Booking Confirmed: ${tourName} - Walk with History`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; color: #374151; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #050505; padding: 30px 20px; text-align: center; border-bottom: 4px solid #F5B400;">
              <h1 style="color: #F5B400; margin: 0; font-size: 28px; letter-spacing: 1px;">Walk with History</h1>
              <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 15px; letter-spacing: 2px; text-transform: uppercase;">Booking Confirmation</p>
            </div>
            
            <div style="padding: 40px 30px;">
              <h3 style="margin-top: 0; color: #111827; font-size: 20px;">Hello ${customerName || 'Guest'},</h3>
              <p style="line-height: 1.6; font-size: 16px;">Thank you for choosing Walk with History. Your booking for <strong>${tourName}</strong> has been successfully confirmed!</p>
              
              <div style="background-color: #f9fafb; border-left: 4px solid #F5B400; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <h4 style="margin-top: 0; margin-bottom: 15px; color: #111827; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Booking Details</h4>
                <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 140px;">Date & Time:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #111827;">${dateStr}${bookingTime ? ` at ${bookingTime}` : ''}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Number of Guests:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #111827;">${count}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Amount to be Paid:</td>
                    <td style="padding: 8px 0; font-weight: bold; color: #d97706; font-size: 16px;">₹${(tour.price || 0) * count}</td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 15px; color: #92400e; line-height: 1.6;">
                  <strong style="display: flex; align-items: center; margin-bottom: 5px;">⚠️ Important Payment Notice</strong> 
                  Please note that the full <strong>Amount to be Paid</strong> must be settled at least <strong>24 hours prior</strong> to your scheduled tour date and time to secure your spots. Our team will reach out to you shortly with the payment instructions.
                </p>
              </div>

              <p style="line-height: 1.6; font-size: 16px;">We look forward to hosting you for an unforgettable heritage experience!</p>
              <br>
              <p style="margin: 0; color: #6b7280; font-size: 16px;">Best Regards,</p>
              <p style="margin: 5px 0 0 0; font-weight: bold; color: #111827; font-size: 18px;">The Walk with History Team</p>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 13px; color: #9ca3af;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Walk with History. All rights reserved.</p>
              <p style="margin: 5px 0 0 0;">Panjim, Goa, India</p>
            </div>
          </div>
        `,
      });
    }

    // 2. Email to Admin
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Booking: ${tourName} on ${dateStr}`,
        html: `
          <h2>New Booking Confirmed</h2>
          <ul>
            <li><strong>Tour:</strong> ${tourName}</li>
            <li><strong>Date:</strong> ${dateStr}</li>
            ${bookingTime ? `<li><strong>Time:</strong> ${bookingTime}</li>` : ''}
            <li><strong>Guests:</strong> ${count}</li>
            <li><strong>Customer Name:</strong> ${customerName || 'N/A'}</li>
            <li><strong>Customer Email:</strong> ${customerEmail || 'N/A'}</li>
            <li><strong>Customer Phone:</strong> ${customerPhone || 'N/A'}</li>
          </ul>
        `,
      });
    }
  } catch (emailErr) {
    // Proceed even if email fails
  }

  res.status(201).json({
    status: 'success',
    data: { booking },
  });
});

/**
 * POST /api/v1/bookings/offline (admin only)
 * Create a completely offline booking — not linked to website. Customer booked via phone/walk-in/etc.
 * Body: tourId, bookingDate, peopleCount, amount, customerName, customerEmail?, customerPhone?, customerAddress?
 * Creates booking + offline payment and confirms in one step.
 */
export const createOfflineBooking = asyncHandler(async (req, res, next) => {
  const {
    tourId,
    bookingDate: rawDate,
    peopleCount,
    amount,
    bookingType,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    paymentMethod = 'offline',
    paymentStatus = 'captured',
  } = req.body;

  if (!tourId || rawDate == null || peopleCount == null || amount == null) {
    return next(new AppError('Missing required fields: tourId, bookingDate, peopleCount, amount', 400));
  }

  const amt = Number(amount);
  if (amt < 0) {
    return next(new AppError('Amount must be non-negative', 400));
  }

  const tour = await Tour.findById(tourId).lean();
  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  const bookingDate = startOfDayUTC(rawDate);
  const today = startOfDayUTC(new Date());
  const maxEnd = addMonthsUTC(today, 3);
  if (bookingDate < today) {
    return next(new AppError('Booking date must be today or a future date', 400));
  }
  if (bookingDate > maxEnd) {
    return next(new AppError('Booking date must be within the next 3 months', 400));
  }

  const count = Number(peopleCount);
  if (count < 1 || count > (tour.maxGroupSize || 50)) {
    return next(new AppError(`People count must be between 1 and ${tour.maxGroupSize}`, 400));
  }

  // Ensure the selected date exists in TourAvailability and is active,
  // and that it still has remaining slots > 0.
  const explicit = await TourAvailability.findOne({
    tourId,
    date: bookingDate,
    $or: [{ isActive: { $exists: false } }, { isActive: true }],
  }).lean();

  if (!explicit) {
    return next(new AppError('Selected date is not available for this tour', 400));
  }

  const remainingFromDoc = Math.max(
    0,
    (explicit.totalSlots ?? 0) - (explicit.bookedSlots ?? 0)
  );
  if (remainingFromDoc <= 0) {
    return next(
      new AppError(
        'Selected date is fully booked. Please choose another date.',
        400
      )
    );
  }

  const availability = await checkAvailability(tourId, bookingDate);
  if (availability.remainingSlots < count) {
    return next(
      new AppError(
        `Insufficient availability. Only ${availability.remainingSlots} slot(s) available, but ${count} requested.`,
        400
      )
    );
  }

  await reserveSlots(tourId, bookingDate, count);

  const type = bookingType === 'private' ? 'private' : 'group';
  const booking = await Booking.create({
    tourId,
    bookingDate,
    peopleCount: count,
    bookingType: type,
    status: 'confirmed', // Directly confirmed for offline
    customerName: customerName?.trim() || undefined,
    customerEmail: customerEmail?.trim() || undefined,
    customerPhone: customerPhone?.trim() || undefined,
    customerAddress: customerAddress?.trim() || undefined,
  });

  booking.totalAmount = amt;
  // booking.status is already 'confirmed' from create
  await booking.save();

  const populated = await Booking.findById(booking._id)
    .populate('tourId', 'name slug')
    .lean();

  res.status(201).json({
    status: 'success',
    data: { booking: populated },
  });
});

/**
 * GET /api/v1/bookings/availability
 * Input: tourId, date (query)
 * Return: availableSlots, totalSlots
 */
export const getAvailability = asyncHandler(async (req, res, next) => {
  const { tourId, date } = req.query;

  if (!tourId || !date) {
    return next(new AppError('Query params tourId and date are required', 400));
  }

  const d = startOfDayUTC(date);
  const today = startOfDayUTC(new Date());
  const maxEnd = addMonthsUTC(today, 3);
  if (d < today) {
    return next(new AppError('Date must be today or a future date', 400));
  }
  if (d > maxEnd) {
    return next(new AppError('Date must be within the next 3 months', 400));
  }

  const result = await checkAvailability(tourId, d);

  // Also return available times[] for this date, if configured
  const tourIdObj = typeof tourId === 'string' ? tourId : String(tourId);
  const doc = await TourAvailability.findOne({
    tourId: tourIdObj,
    date: d,
  }).lean();
  const times = normalizeTimesList(doc?.times ?? []);
  res.status(200).json({
    status: 'success',
    data: {
      availableSlots: result.remainingSlots,
      totalSlots: result.totalSlots,
      times,
    },
  });
});

/**
 * GET /api/v1/bookings/availability/range
 * Input: tourId, startDate, endDate (query)
 * Return: Array of availability for each date in range
 */
export const getAvailabilityRange = asyncHandler(async (req, res, next) => {
  const { tourId, startDate, endDate } = req.query;

  if (!tourId || !startDate || !endDate) {
    return next(new AppError('Query params tourId, startDate, and endDate are required', 400));
  }

  const start = startOfDayUTC(startDate);
  const end = startOfDayUTC(endDate);
  const today = startOfDayUTC(new Date());
  const maxEnd = addMonthsUTC(today, 3);

  if (end < start) {
    return next(new AppError('endDate must be after startDate', 400));
  }
  if (start < today) {
    return next(new AppError('startDate must be today or a future date', 400));
  }
  if (end > maxEnd) {
    return next(new AppError('endDate must be within the next 3 months', 400));
  }

  const results = await getAvailabilityForRange(tourId, startDate, endDate);
  res.status(200).json({
    status: 'success',
    data: {
      availability: results,
    },
  });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const { tour, status, bookingType } = req.query;
  const filter = {};
  if (tour) filter.tourId = tour;
  if (status) filter.status = status;
  if (bookingType === 'private') {
    filter.bookingType = 'private';
  } else if (bookingType === 'group') {
    filter.$or = [{ bookingType: 'group' }, { bookingType: { $exists: false } }];
  }

  const bookings = await Booking.find(filter)
    .populate('tourId', 'name slug')
    .sort({ bookingDate: -1, createdAt: -1 })
    .lean();

  res.status(200).json({
    status: 'success',
    data: { bookings },
  });
});

export const getBookingById = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate('tourId', 'name slug price').lean();
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { booking },
  });
});

export const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'paid', 'cancelled'].includes(status)) {
    return next(new AppError('Status must be pending, confirmed, paid, or cancelled', 400));
  }

  const existing = await Booking.findById(id);
  if (!existing) {
    return next(new AppError('Booking not found', 404));
  }

  const wasCancelled = existing.status === 'cancelled';
  const willBeCancelled = status === 'cancelled';

  if (wasCancelled && !willBeCancelled) {
    await reserveSlots(existing.tourId, existing.bookingDate, existing.peopleCount);
  }

  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

  if (!wasCancelled && willBeCancelled) {
    await releaseSlots(existing.tourId, existing.bookingDate, existing.peopleCount);
  }

  res.status(200).json({
    status: 'success',
    data: { booking },
  });
});

export const deleteBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Release slots if booking is not cancelled
  if (booking.status !== 'cancelled') {
    await releaseSlots(booking.tourId, booking.bookingDate, booking.peopleCount);
  }

  await Booking.findByIdAndDelete(id);

  res.status(200).json({
    status: 'success',
    data: null,
    message: 'Booking deleted successfully',
  });
});
