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
                    $addFields: {
                        testCond1: { $in: ['$status', ['confirmed', 'paid']] },
                        testCond2: { $cond: [{ $in: ['$status', ['confirmed', 'paid']] }, 1, 0] },
                        testCond3: { $cond: [{ $in: ['$status', ['confirmed', 'paid']] }, { $ifNull: ['$totalAmount', -1] }, -2] },
                        testCond4: { $ifNull: ['$totalAmount', -1] }
                    }
                },
                { $limit: 1 }
            ]).toArray();
            console.log(JSON.stringify(res, null, 2));
        } catch (err) {
            console.error(err);
        }
        mongoose.disconnect();
    });
