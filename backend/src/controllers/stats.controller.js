import asyncHandler from 'express-async-handler';
import Tour from '../models/Tour.js';
import Enquiry from '../models/Enquiry.js';
import Testimonial from '../models/Testimonial.js';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalTours,
    totalEnquiries,
    pendingEnquiries,
    totalTestimonials,
    totalBookings,
    confirmedBookings,
    pendingBookings,
  ] = await Promise.all([
    Tour.countDocuments(),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: 'pending' }),
    Testimonial.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'confirmed' }),
    Booking.countDocuments({ status: 'pending' }),
  ]);

  // Get recent enquiries
  const recentEnquiries = await Enquiry.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Get recent bookings
  const recentBookings = await Booking.find()
    .populate('tourId', 'name')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalTours,
        totalEnquiries,
        pendingEnquiries,
        totalTestimonials,
        totalBookings,
        confirmedBookings,
        pendingBookings,
      },
      recentEnquiries,
      recentBookings,
    },
  });
});

/** Parse "YYYY-MM-DD" (or any Date-ish) to UTC start-of-day. */
const startOfDayUTC = (d) => {
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.trim())) {
    return new Date(d.trim() + 'T00:00:00.000Z');
  }
  const dt = new Date(d);
  return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
};

/** Parse "YYYY-MM-DD" (or any Date-ish) to UTC end-of-day. */
const endOfDayUTC = (d) => {
  const s = startOfDayUTC(d);
  return new Date(s.getTime() + 24 * 60 * 60 * 1000 - 1);
};

const safeObjectId = (id) => {
  if (!id) return null;
  try {
    return new mongoose.Types.ObjectId(String(id));
  } catch {
    return null;
  }
};

/**
 * GET /api/v1/stats/analytics
 *
 * Query:
 * - start: YYYY-MM-DD (inclusive)
 * - end: YYYY-MM-DD (inclusive)
 * - groupBy: day | week | month (default: day)
 * - tour: ObjectId (optional)
 * - bookingStatus: pending|confirmed|cancelled (optional)
 * - paymentStatus: created|pending|captured|failed|refunded (optional)
 *
 * Returns:
 * - summary cards (revenue, bookings, customers...)
 * - timeseries (grouped)
 * - breakdowns (top tours, by status, by method)
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const {
    start,
    end,
    groupBy = 'day',
    tour,
    bookingStatus,
    paymentStatus,
    bookingType,
  } = req.query;

  // Default range: last 30 days (inclusive)
  const endDate = end ? endOfDayUTC(end) : endOfDayUTC(new Date());
  const startDate = start ? startOfDayUTC(start) : new Date(endDate.getTime() - 29 * 24 * 60 * 60 * 1000);

  const group = String(groupBy).toLowerCase();
  const groupFormat =
    group === 'month'
      ? '%Y-%m'
      : group === 'week'
        ? '%G-W%V'
        : '%Y-%m-%d';

  const tourId = safeObjectId(tour);

  const bookingMatch = {
    bookingDate: { $gte: startDate, $lte: endDate },
  };
  if (tourId) bookingMatch.tourId = tourId;
  if (bookingStatus) bookingMatch.status = bookingStatus;

  if (bookingType === 'private') {
    bookingMatch.bookingType = 'private';
  } else if (bookingType === 'group') {
    bookingMatch.$or = [{ bookingType: 'group' }, { bookingType: { $exists: false } }];
  }

  // Optional payment lookup (keeping it in case some legacy payments exist)
  const basePipeline = [
    { $match: bookingMatch },
    {
      $lookup: {
        from: 'payments',
        localField: 'paymentId',
        foreignField: '_id',
        as: 'payment',
      },
    },
    { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
  ];

  // Summary cards
  const summaryPipeline = [
    ...basePipeline,
    {
      $addFields: {
        revenueCaptured: {
          $cond: [
            { $in: ['$status', ['confirmed', 'paid']] },
            { $ifNull: ['$totalAmount', 0] },
            0,
          ],
        },
        revenueGross: {
          $ifNull: ['$totalAmount', 0],
        },
        customerKey: {
          $ifNull: [
            { $toLower: { $trim: { input: '$customerEmail' } } },
            { $concat: ['phone:', { $ifNull: ['$customerPhone', ''] }] },
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        bookings: { $sum: 1 },
        people: { $sum: { $ifNull: ['$peopleCount', 0] } },
        confirmedBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] },
        },
        pendingBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
        },
        revenueCaptured: { $sum: '$revenueCaptured' },
        revenueGross: { $sum: '$revenueGross' },
        capturedPayments: {
          $sum: { $cond: [{ $in: ['$status', ['confirmed', 'paid']] }, 1, 0] },
        },
        refundedAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, { $ifNull: ['$totalAmount', 0] }, 0] },
        },
        customersSet: { $addToSet: '$customerKey' },
      },
    },
    {
      $project: {
        _id: 0,
        bookings: 1,
        people: 1,
        confirmedBookings: 1,
        pendingBookings: 1,
        cancelledBookings: 1,
        revenueCaptured: 1,
        revenueGross: 1,
        capturedPayments: 1,
        refundedAmount: 1,
        customers: { $size: '$customersSet' },
        avgOrderValue: {
          $cond: [
            { $gt: ['$capturedPayments', 0] },
            {
              $round: [
                {
                  $divide: [
                    '$revenueCaptured',
                    { $cond: [{ $eq: ['$capturedPayments', 0] }, 1, '$capturedPayments'] }
                  ]
                },
                2
              ]
            },
            0,
          ],
        },
      },
    },
  ];

  // Timeseries
  const seriesPipeline = [
    ...basePipeline,
    {
      $addFields: {
        bucket: {
          $dateToString: { format: groupFormat, date: '$bookingDate' },
        },
        revenueCaptured: {
          $cond: [
            { $in: ['$status', ['confirmed', 'paid']] },
            { $ifNull: ['$totalAmount', 0] },
            0,
          ],
        },
        customerKey: {
          $ifNull: [
            { $toLower: { $trim: { input: '$customerEmail' } } },
            { $concat: ['phone:', { $ifNull: ['$customerPhone', ''] }] },
          ],
        },
      },
    },
    {
      $group: {
        _id: '$bucket',
        revenue: { $sum: '$revenueCaptured' },
        bookings: { $sum: 1 },
        customersSet: { $addToSet: '$customerKey' },
      },
    },
    {
      $project: {
        _id: 0,
        bucket: '$_id',
        revenue: 1,
        bookings: 1,
        customers: { $size: '$customersSet' },
      },
    },
    { $sort: { bucket: 1 } },
  ];

  // Top tours
  const topToursPipeline = [
    ...basePipeline,
    {
      $addFields: {
        revenueCaptured: {
          $cond: [
            { $in: ['$status', ['confirmed', 'paid']] },
            { $ifNull: ['$totalAmount', 0] },
            0,
          ],
        },
      },
    },
    {
      $group: {
        _id: '$tourId',
        bookings: { $sum: 1 },
        revenue: { $sum: '$revenueCaptured' },
      },
    },
    { $sort: { revenue: -1, bookings: -1 } },
    { $limit: 8 },
    {
      $lookup: {
        from: Tour.collection.name,
        localField: '_id',
        foreignField: '_id',
        as: 'tour',
      },
    },
    { $unwind: { path: '$tour', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        tourId: '$_id',
        name: { $ifNull: ['$tour.name', 'Unknown tour'] },
        bookings: 1,
        revenue: 1,
      },
    },
  ];

  // Payment method breakdown (only for captured payments)
  const paymentMethodsPipeline = [
    ...basePipeline,
    { $match: { status: { $in: ['confirmed', 'paid'] } } },
    {
      $group: {
        _id: 'cash/other', // defaulting to cash/other since Razorpay is gone
        revenue: { $sum: { $ifNull: ['$totalAmount', 0] } },
        payments: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    {
      $project: {
        _id: 0,
        method: '$_id',
        revenue: 1,
        payments: 1,
      },
    },
  ];

  // Repeated customers: customers with more than one booking in range
  const repeatedPipeline = [
    ...basePipeline,
    {
      $addFields: {
        customerKey: {
          $ifNull: [
            { $toLower: { $trim: { input: '$customerEmail' } } },
            { $concat: ['phone:', { $ifNull: ['$customerPhone', ''] }] },
          ],
        },
      },
    },
    { $group: { _id: '$customerKey', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
    { $count: 'repeatedCustomers' },
  ];

  // Booking type breakdown
  const bookingTypesPipeline = [
    ...basePipeline,
    {
      $group: {
        _id: { $ifNull: ['$bookingType', 'group'] },
        revenue: {
          $sum: {
            $cond: [
              { $in: ['$status', ['confirmed', 'paid']] },
              { $ifNull: ['$totalAmount', 0] },
              0,
            ],
          },
        },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    {
      $project: {
        _id: 0,
        type: '$_id',
        revenue: 1,
        bookings: 1,
      },
    },
  ];

  const [summaryArr, series, topTours, paymentMethods, repeatedArr, bookingTypes] = await Promise.all([
    Booking.aggregate(summaryPipeline),
    Booking.aggregate(seriesPipeline),
    Booking.aggregate(topToursPipeline),
    Booking.aggregate(paymentMethodsPipeline),
    Booking.aggregate(repeatedPipeline),
    Booking.aggregate(bookingTypesPipeline),
  ]);

  const repeatedCustomers = repeatedArr?.[0]?.repeatedCustomers ?? 0;
  const summaryRaw = summaryArr?.[0] || {
    bookings: 0,
    people: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    revenueCaptured: 0,
    revenueGross: 0,
    capturedPayments: 0,
    refundedAmount: 0,
    customers: 0,
    avgOrderValue: 0,
  };
  const summary = {
    ...summaryRaw,
    distinctCustomers: summaryRaw.customers,
    repeatedCustomers,
  };

  res.status(200).json({
    status: 'success',
    data: {
      range: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        groupBy: group,
      },
      summary,
      series,
      breakdowns: {
        topTours,
        paymentMethods,
        bookingTypes,
      },
    },
  });
});
