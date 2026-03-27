import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/goa-tours';
mongoose.connect(uri)
    .then(async () => {
        const Booking = mongoose.connection.collection('bookings');
        try {
            const res = await Booking.aggregate([
                { $match: { status: 'confirmed' } },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        revenueCaptured1: { $sum: { $cond: [{ $in: ['$status', ['confirmed', 'paid']] }, { $ifNull: ['$totalAmount', 0] }, 0] } },
                        revenueCaptured2: { $sum: { $cond: [{ $or: [{ $eq: ['$status', 'confirmed'] }, { $eq: ['$status', 'paid'] }] }, { $ifNull: ['$totalAmount', 0] }, 0] } },
                        testTotal: { $sum: '$totalAmount' }
                    }
                }
            ]).toArray();
            console.log(JSON.stringify(res, null, 2));
        } catch (err) {
            console.error(err);
        }
        mongoose.disconnect();
    });
