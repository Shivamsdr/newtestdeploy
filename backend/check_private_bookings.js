import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Booking from './src/models/Booking.js';
import Tour from './src/models/Tour.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/walkwithhistory';

async function runTest() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const privateBooking = await Booking.findOne({ bookingType: 'private' }).lean();

        if (privateBooking) {
            console.log('Sample Private Booking:', privateBooking._id);
            console.log('Tour ID:', privateBooking.tourId);

            if (privateBooking.tourId) {
                const tour = await Tour.findById(privateBooking.tourId).lean();
                if (tour) {
                    console.log('Tour Name:', tour.name);
                } else {
                    console.log('Tour NOT FOUND with ID:', privateBooking.tourId);
                }
            } else {
                console.log('No Tour ID explicitly set (should be required)');
            }
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
