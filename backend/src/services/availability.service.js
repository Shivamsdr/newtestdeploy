import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';
import TourAvailability from '../models/TourAvailability.js';
import { AppError } from '../utils/AppError.js';

/** Parse date as UTC start-of-day. Handles "YYYY-MM-DD" from query params explicitly. */
const startOfDayUTC = (d) => {
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.trim())) {
    return new Date(d.trim() + 'T00:00:00.000Z');
  }
  const dt = new Date(d);
  return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
};

/** Normalize a list of HH:mm strings: trim, validate, unique, sort. */
const normalizeTimes = (times) => {
  if (!Array.isArray(times)) return [];
  const cleaned = times
    .map((t) => (typeof t === 'string' ? t.trim() : ''))
    .filter(Boolean);
  const valid = cleaned.filter((t) => /^\d{2}:\d{2}$/.test(t));
  const unique = Array.from(new Set(valid));
  unique.sort();
  return unique;
};

/**
 * Sync bookedSlots with actual bookings to prevent data inconsistency.
 * Uses date range to ensure we catch all bookings for the day (handles any timezone edge cases).
 * @param {string|ObjectId} tourId
 * @param {Date} date - UTC start of day
 * @returns {Promise<number>} Actual booked slots count
 */
async function syncBookedSlots(tourId, date) {
  // Ensure date is start of day UTC
  const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

  // Convert tourId to ObjectId if it's a string to ensure proper matching
  const tourIdObj = typeof tourId === 'string' ? new mongoose.Types.ObjectId(tourId) : tourId;

  const agg = await Booking.aggregate([
    {
      $match: {
        tourId: tourIdObj,
        bookingDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        status: { $in: ['pending', 'confirmed'] },
      },
    },
    { $group: { _id: null, total: { $sum: '$peopleCount' } } },
  ]);
  return agg[0]?.total ?? 0;
}

/**
 * Get or create TourAvailability for (tourId, date).
 * When creating, totalSlots = tour.maxGroupSize, bookedSlots = sum of peopleCount
 * from existing pending/confirmed bookings for that tour+date.
 * Also syncs totalSlots if it differs from tour.maxGroupSize (e.g., after admin update).
 * Periodically syncs bookedSlots to prevent data inconsistency.
 * @param {string|ObjectId} tourId
 * @param {Date|string} date
 * @returns {Promise<{ tourId, date, totalSlots, bookedSlots }>}
 */
export async function ensureAvailabilityRecord(tourId, date) {
  const d = startOfDayUTC(date);
  // Convert tourId to ObjectId if needed for consistent querying
  const tourIdObj = typeof tourId === 'string' ? new mongoose.Types.ObjectId(tourId) : tourId;

  let doc = await TourAvailability.findOne({ tourId: tourIdObj, date: d }).lean();

  const tour = await Tour.findById(tourIdObj).select('maxGroupSize').lean();
  if (!tour) throw new AppError('Tour not found', 404);

  const newTotalSlots = tour.maxGroupSize ?? 0;

  // If record exists, sync both totalSlots and bookedSlots
  if (doc) {
    const actualBookedSlots = await syncBookedSlots(tourId, d);
    const needsUpdate = doc.totalSlots !== newTotalSlots || doc.bookedSlots !== actualBookedSlots;

    if (needsUpdate) {
      await TourAvailability.updateOne(
        { tourId: tourIdObj, date: d },
        {
          $set: {
            totalSlots: newTotalSlots,
            bookedSlots: actualBookedSlots
          }
        }
      );
      doc.totalSlots = newTotalSlots;
      doc.bookedSlots = actualBookedSlots;
    }
    return doc;
  }

  // Create new record - sync bookedSlots from actual bookings
  const bookedSlots = await syncBookedSlots(tourId, d);

  try {
    const created = await TourAvailability.create({
      tourId: tourIdObj,
      date: d,
      totalSlots: newTotalSlots,
      bookedSlots,
    });
    return created.toObject();
  } catch (err) {
    if (err.code === 11000) {
      doc = await TourAvailability.findOne({ tourId: tourIdObj, date: d }).lean();
      if (doc) {
        // Sync on retry
        const actualBookedSlots = await syncBookedSlots(tourId, d);
        if (doc.bookedSlots !== actualBookedSlots || doc.totalSlots !== newTotalSlots) {
          await TourAvailability.updateOne(
            { tourId: tourIdObj, date: d },
            {
              $set: {
                totalSlots: newTotalSlots,
                bookedSlots: actualBookedSlots
              }
            }
          );
          doc.totalSlots = newTotalSlots;
          doc.bookedSlots = actualBookedSlots;
        }
      }
      return doc;
    }
    throw err;
  }
}

/**
 * Check availability for a tour on a given date.
 * Ensures bookedSlots + requested ≤ totalSlots for reporting; does not reserve.
 * Always syncs from actual bookings to ensure accuracy.
 * @param {string|ObjectId} tourId
 * @param {Date|string} date
 * @returns {Promise<{ available: boolean, remainingSlots: number, totalSlots: number, bookedSlots: number, date: string }>}
 */
export async function checkAvailability(tourId, date) {
  const d = startOfDayUTC(date);
  // Convert tourId to ObjectId if needed
  const tourIdObj = typeof tourId === 'string' ? new mongoose.Types.ObjectId(tourId) : tourId;

  await ensureAvailabilityRecord(tourId, date);

  // Always sync bookedSlots from actual bookings to ensure we have the latest count
  // This is critical after bookings are created - it ensures we see the new booking immediately
  const actualBookedSlots = await syncBookedSlots(tourId, d);

  // Update the stored value to match actual bookings
  await TourAvailability.updateOne(
    { tourId: tourIdObj, date: d },
    { $set: { bookedSlots: actualBookedSlots } }
  );

  // Fetch the latest document to ensure we have the most up-to-date totalSlots as well
  const doc = await TourAvailability.findOne({ tourId: tourIdObj, date: d }).lean();
  if (!doc) {
    // Should not happen, but handle gracefully
    const tour = await Tour.findById(tourIdObj).select('maxGroupSize').lean();
    const totalSlots = tour?.maxGroupSize ?? 0;
    return {
      available: actualBookedSlots < totalSlots,
      remainingSlots: Math.max(0, totalSlots - actualBookedSlots),
      totalSlots,
      bookedSlots: actualBookedSlots,
      date: d.toISOString().slice(0, 10),
    };
  }

  const remaining = Math.max(0, doc.totalSlots - actualBookedSlots);
  return {
    available: remaining > 0,
    remainingSlots: remaining,
    totalSlots: doc.totalSlots,
    bookedSlots: actualBookedSlots, // Use synced value, not stored value
    date: doc.date.toISOString().slice(0, 10),
  };
}

/**
 * Atomically reserve slots: only updates if bookedSlots + peopleCount ≤ totalSlots.
 * Prevents overbooking at database level.
 * @param {string|ObjectId} tourId
 * @param {Date|string} date
 * @param {number} peopleCount
 * @throws {AppError} 400 if availability insufficient
 */
export async function reserveSlots(tourId, date, peopleCount) {
  await ensureAvailabilityRecord(tourId, date);
  const d = startOfDayUTC(date);
  // Convert tourId to ObjectId if needed
  const tourIdObj = typeof tourId === 'string' ? new mongoose.Types.ObjectId(tourId) : tourId;
  const count = Number(peopleCount);
  if (count < 1) throw new AppError('peopleCount must be at least 1', 400);

  const updated = await TourAvailability.findOneAndUpdate(
    {
      tourId: tourIdObj,
      date: d,
      $expr: { $lte: [{ $add: ['$bookedSlots', count] }, '$totalSlots'] },
    },
    { $inc: { bookedSlots: count } },
    { new: true }
  );

  if (!updated) {
    const doc = await TourAvailability.findOne({ tourId: tourIdObj, date: d }).lean();
    const remaining = doc ? Math.max(0, doc.totalSlots - doc.bookedSlots) : 0;
    throw new AppError(
      `Insufficient availability. Only ${remaining} slot(s) left for this date.`,
      400
    );
  }
  return updated;
}

/**
 * Release slots (e.g. when a booking is cancelled). Keeps bookedSlots ≥ 0.
 * @param {string|ObjectId} tourId
 * @param {Date|string} date
 * @param {number} peopleCount
 */
export async function releaseSlots(tourId, date, peopleCount) {
  const d = startOfDayUTC(date);
  // Convert tourId to ObjectId if needed
  const tourIdObj = typeof tourId === 'string' ? new mongoose.Types.ObjectId(tourId) : tourId;
  const count = Number(peopleCount);
  await TourAvailability.findOneAndUpdate(
    { tourId: tourIdObj, date: d },
    [{ $set: { bookedSlots: { $max: [0, { $subtract: ['$bookedSlots', count] }] } } }]
  );
}

/**
 * Sync all TourAvailability records for a tour when maxGroupSize changes.
 * Updates totalSlots for all existing records to match the new tour.maxGroupSize.
 * @param {string|ObjectId} tourId
 * @param {number} newMaxGroupSize
 * @returns {Promise<{ updatedCount: number }>}
 */
export async function syncAvailabilityForTour(tourId, newMaxGroupSize) {
  const totalSlots = newMaxGroupSize ?? 0;
  const result = await TourAvailability.updateMany(
    { tourId },
    { $set: { totalSlots } }
  );
  return { updatedCount: result.modifiedCount };
}

/**
 * Get availability for a range of dates.
 * @param {string|ObjectId} tourId
 * @param {Date|string} startDate - Start date (YYYY-MM-DD)
 * @param {Date|string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array<{ date: string, availableSlots: number, totalSlots: number, bookedSlots: number }>>}
 */
export async function getAvailabilityForRange(tourId, startDate, endDate) {
  const start = startOfDayUTC(startDate);
  const end = startOfDayUTC(endDate);

  if (end < start) {
    throw new AppError('End date must be after start date', 400);
  }

  const results = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    const availability = await checkAvailability(tourId, dateStr);
    results.push({
      date: dateStr,
      availableSlots: availability.remainingSlots,
      totalSlots: availability.totalSlots,
      bookedSlots: availability.bookedSlots,
    });
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return results;
}

/**
 * Get availability (including optional times[]) for a range of dates.
 * Intended for admin management UI.
 *
 * Optimized to avoid per-day DB round trips by:
 * - aggregating bookings over the whole range
 * - fetching all TourAvailability docs in one query
 * - computing day-level availability in memory
 *
 * @param {string|ObjectId} tourId
 * @param {Date|string} startDate - Start date (YYYY-MM-DD)
 * @param {Date|string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array<{ date: string, totalSlots: number, bookedSlots: number, availableSlots: number, times: string[] }>>}
 */
export async function getAvailabilityForRangeWithTimes(tourId, startDate, endDate) {
  const start = startOfDayUTC(startDate);
  const end = startOfDayUTC(endDate);

  if (end < start) {
    throw new AppError('End date must be after start date', 400);
  }

  const tourIdObj = typeof tourId === 'string' ? new mongoose.Types.ObjectId(tourId) : tourId;

  // Ensure the tour exists and get its maxGroupSize for default totalSlots
  const tour = await Tour.findById(tourIdObj).select('maxGroupSize').lean();
  if (!tour) {
    throw new AppError('Tour not found', 404);
  }
  const defaultTotalSlots = tour.maxGroupSize ?? 0;

  const dayAfterEnd = new Date(end);
  dayAfterEnd.setUTCDate(dayAfterEnd.getUTCDate() + 1);

  // Aggregate bookings for the whole range (pending + confirmed)
  const [bookingsAgg, availabilityDocs] = await Promise.all([
    Booking.aggregate([
      {
        $match: {
          tourId: tourIdObj,
          bookingDate: {
            $gte: start,
            $lt: dayAfterEnd,
          },
          status: { $in: ['pending', 'confirmed'] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$bookingDate' },
          },
          total: { $sum: '$peopleCount' },
        },
      },
    ]),
    TourAvailability.find({
      tourId: tourIdObj,
      date: {
        $gte: start,
        $lte: end,
      },
    }).lean(),
  ]);

  // Build lookup maps
  const bookingsMap = {};
  bookingsAgg.forEach((b) => {
    if (b?._id) bookingsMap[b._id] = b.total ?? 0;
  });

  const availabilityMap = {};
  availabilityDocs.forEach((doc) => {
    if (doc?.date) {
      const key = doc.date.toISOString().slice(0, 10);
      availabilityMap[key] = doc;
    }
  });

  // Build results for each day in the range
  const results = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    const doc = availabilityMap[dateStr];

    // STRICT AVAILABILITY:
    // If no record exists, default to 0 slots (closed).
    // If record exists but is inactive, treat as 0 slots.
    let totalSlots = 0;
    if (doc) {
      // Default to true if undefined (legacy records fetched via lean())
      const isActive = doc.isActive !== false;
      totalSlots = isActive ? doc.totalSlots : 0;
    } else {
      totalSlots = 0; // Default closed if no record
    }

    // Prefer live booking aggregation; fall back to stored bookedSlots if missing
    const bookedFromAgg = bookingsMap[dateStr];
    const bookedSlots =
      typeof bookedFromAgg === 'number'
        ? bookedFromAgg
        : typeof doc?.bookedSlots === 'number'
          ? doc.bookedSlots
          : 0;

    const availableSlots = Math.max(0, totalSlots - bookedSlots);

    results.push({
      date: dateStr,
      availableSlots,
      totalSlots,
      bookedSlots,
      times: normalizeTimes(doc?.times ?? []),
    });

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return results;
}

/**
 * Set times[] for a tour on a given date (creates availability record if missing).
 * @param {string|ObjectId} tourId
 * @param {Date|string} date - YYYY-MM-DD
 * @param {string[]} times - HH:mm strings
 * @returns {Promise<{ date: string, times: string[] }>}
 */
export async function setTimesForDate(tourId, date, times) {
  await ensureAvailabilityRecord(tourId, date);
  const d = startOfDayUTC(date);
  const tourIdObj = typeof tourId === 'string' ? new mongoose.Types.ObjectId(tourId) : tourId;
  const normalized = normalizeTimes(times);

  await TourAvailability.updateOne(
    { tourId: tourIdObj, date: d },
    { $set: { times: normalized } }
  );

  return { date: d.toISOString().slice(0, 10), times: normalized };
}
