import asyncHandler from 'express-async-handler';
import Tour from '../models/Tour.js';
import { AppError } from '../utils/AppError.js';
import TourAvailability from '../models/TourAvailability.js';
import { syncAvailabilityForTour, getAvailabilityForRangeWithTimes, setTimesForDate } from '../services/availability.service.js';

/** Parse "YYYY-MM-DD" (or any Date-ish) to UTC start-of-day. */
const startOfDayUTC = (d) => {
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.trim())) {
    return new Date(d.trim() + 'T00:00:00.000Z');
  }
  const dt = new Date(d);
  return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
};

const isValidYMD = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.trim());

const addMonthsUTC = (date, months) => {
  const d = new Date(date);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
};

export const getAllTours = asyncHandler(async (req, res) => {
  const { q, date, exp, category, dayType } = req.query;

  // Build filter object
  const filter = {};

  // Category filter
  if (category && ['Exclusive', 'Premium', 'Budget', 'Adventure'].includes(category)) {
    filter.category = category;
  }

  // Day Type filter
  if (dayType && ['half-day', 'full-day'].includes(dayType)) {
    filter.dayType = dayType;
  }

  // 1. Text Search (Name, Summary, Tags)
  if (q && q.trim()) {
    const searchRegex = new RegExp(q.trim(), 'i');
    filter.$or = [
      { name: searchRegex },
      { summary: searchRegex },
      { tags: searchRegex },
    ];
  }

  // 2. Experience/Tag Filter
  if (exp && exp.trim()) {
    // If we already have an $or for 'q', we need to retain it and add 'tags' via $and
    // But simplest is: if 'exp' is set, 'tags' must match it.
    // 'exp' usually comes from the homepage vibes (e.g. 'village', 'food')
    filter.tags = new RegExp(exp.trim(), 'i');
  }

  // 3. Date Availability Filter
  // If a date is provided, we only want tours that have availability on that date.
  // This requires a look-up in TourAvailability.
  let availableTourIds = null;
  if (date && isValidYMD(date)) {
    const targetDate = startOfDayUTC(date);

    // Find all availability records for this date where availableSlots > 0
    // We compute availableSlots = totalSlots - bookedSlots
    // So we need: totalSlots - bookedSlots > 0  =>  totalSlots > bookedSlots
    // Also check isActive is potentially true (default true)

    // Note: ensureAvailabilityRecord logic is "lazy" (records created on demand).
    // However, for search, we can only search *existing* records or assume default availability.
    // BUT: if a tour has NO record for a date, it usually implies full availability (maxGroupSize) 
    // UNLESS we want to be strict.
    //
    // Design decision: 
    // - If strict: only show tours with explicit positive availability record.
    // - If loose (better for UX): Show all tours EXCEPT those fully booked.
    // 
    // Let's go with: Find tours that are explicitly FULL or CLOSED, and exclude them.
    // Or simpler: Find valid tours.
    //
    // Actually, `TourAvailability` is created on first booking or admin action.
    // If no record exists, the tour is implicitly available (0 bookings).
    // So we should find tours that are "Sold Out" or "Closed" and exclude them.

    // Step A: Find broken/full availability records
    const unavailableDocs = await TourAvailability.find({
      date: targetDate,
      $or: [
        { isActive: false },
        { $expr: { $lte: ['$totalSlots', '$bookedSlots'] } }
      ]
    }).select('tourId').lean();

    const excludedTourIds = unavailableDocs.map(d => d.tourId.toString());

    // Debug logging removed

    if (excludedTourIds.length > 0) {
      filter._id = { $nin: excludedTourIds };
    }
  }

  const tours = await Tour.find(filter).lean();

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

export const getTourById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id).lean();

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

export const createTour = asyncHandler(async (req, res) => {
  const tour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

export const updateTour = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Check if maxGroupSize is being updated
  const maxGroupSizeChanged = req.body.maxGroupSize !== undefined;
  const oldTour = maxGroupSizeChanged ? await Tour.findById(id).lean() : null;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  if (maxGroupSizeChanged && oldTour && oldTour.maxGroupSize !== tour.maxGroupSize) {
    try {
      await syncAvailabilityForTour(id, tour.maxGroupSize);
    } catch (error) {
      // Log error but don't fail the tour update
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

export const deleteTour = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * GET /api/v1/tours/:id/availability?start=YYYY-MM-DD&end=YYYY-MM-DD (admin only)
 * Returns day-level availability plus optional times[] for each date.
 * Constrained to today..today+3 months to avoid heavy reads.
 */
export const getTourAvailabilityAdmin = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { start, end } = req.query;

  if (!isValidYMD(start) || !isValidYMD(end)) {
    return next(new AppError('Query params start and end are required (YYYY-MM-DD)', 400));
  }

  const startD = startOfDayUTC(start);
  const endD = startOfDayUTC(end);
  const today = startOfDayUTC(new Date());
  const maxEnd = addMonthsUTC(today, 3);

  if (endD < startD) {
    return next(new AppError('end must be after start', 400));
  }
  if (startD < today) {
    return next(new AppError('start must be today or a future date', 400));
  }
  if (endD > maxEnd) {
    return next(new AppError('end must be within the next 3 months', 400));
  }

  // Ensure tour exists (clear error message vs CastError)
  const tour = await Tour.findById(id).select('_id name').lean();
  if (!tour) return next(new AppError('Tour not found', 404));

  const availability = await getAvailabilityForRangeWithTimes(id, start, end);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
      availability,
    },
  });
});

/**
 * PUT /api/v1/tours/:id/availability/:date (admin only)
 * Body: { times: ["09:00","14:00"] }
 */
export const setTourAvailabilityTimesAdmin = asyncHandler(async (req, res, next) => {
  const { id, date } = req.params;

  if (!isValidYMD(date)) {
    return next(new AppError('date param must be in YYYY-MM-DD format', 400));
  }

  const d = startOfDayUTC(date);
  const today = startOfDayUTC(new Date());
  const maxEnd = addMonthsUTC(today, 3);

  if (d < today) {
    return next(new AppError('date must be today or a future date', 400));
  }
  if (d > maxEnd) {
    return next(new AppError('date must be within the next 3 months', 400));
  }

  const tour = await Tour.findById(id).select('_id').lean();
  if (!tour) return next(new AppError('Tour not found', 404));

  const result = await setTimesForDate(id, date, req.body?.times ?? []);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});
