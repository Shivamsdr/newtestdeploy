import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';
import { getAvailabilityForRangeWithTimes } from '../services/availability.service.js';
import Tour from '../models/Tour.js';

/** Parse to UTC start-of-day (YYYY-MM-DD or Date) */
const startOfDayUTC = (d) => {
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.trim())) {
    return new Date(d.trim() + 'T00:00:00.000Z');
  }
  const dt = new Date(d);
  return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
};

/**
 * GET /api/v1/availability/:tourId
 *
 * Returns ONLY dates that:
 * - Have an explicit TourAvailability record (or effective capacity via range helper)
 * - date >= today
 * - availableSlots > 0
 *
 * Response is a plain array (no wrapper object):
 * [
 *   { "date": "2026-02-10", "remainingSlots": 5 },
 *   ...
 * ]
 */
export const getPublicAvailabilityForTour = asyncHandler(async (req, res, next) => {
  const { tourId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tourId)) {
    return next(new AppError('Invalid tourId', 400));
  }

  // Ensure tour exists (clearer error than CastError)
  const tour = await Tour.findById(tourId).select('_id').lean();
  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  const today = startOfDayUTC(new Date());
  const end = startOfDayUTC(new Date());
  end.setUTCMonth(end.getUTCMonth() + 3);

  // Re‑use the existing admin helper so behaviour matches what you see there.
  const range = await getAvailabilityForRangeWithTimes(
    tourId,
    today.toISOString().slice(0, 10),
    end.toISOString().slice(0, 10)
  );

  const rows = range
    .filter((d) => (d?.availableSlots ?? 0) > 0 && Array.isArray(d.times) && d.times.length > 0)
    .map((d) => ({
      date: d.date, // already YYYY-MM-DD
      remainingSlots: d.availableSlots,
    }));

  res.status(200).json(rows);
});

