import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Booking from './src/models/Booking.js';
import Payment from './src/models/Payment.js';
import Tour from './src/models/Tour.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/walkwithhistory';

async function runTest() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        // Replicate the pipeline logic from stats.controller.js
        const startDate = new Date('2026-02-01T00:00:00.000Z');
        const endDate = new Date('2026-02-28T23:59:59.999Z');

        const bookingMatch = {
            bookingDate: { $gte: startDate, $lte: endDate },
        };

        const basePipeline = [
            { $match: bookingMatch },
            {
                $lookup: {
                    from: Payment.collection.name, // "payments"
                    localField: 'paymentId',
                    foreignField: '_id',
                    as: 'payment',
                },
            },
            { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
        ];

        const bookingTypesPipeline = [
            ...basePipeline,
            {
                $group: {
                    _id: { $ifNull: ['$bookingType', 'group'] },
                    revenue: {
                        $sum: { $cond: [{ $eq: ['$payment.status', 'captured'] }, '$payment.amount', 0] },
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

        console.log('Running aggregation...');
        const result = await Booking.aggregate(bookingTypesPipeline);
        console.log('Aggregation result:', JSON.stringify(result, null, 2));

    } catch (err) {
        console.error('AGGREGATION ERROR:', err);
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
