
import mongoose from 'mongoose';
import Tour from './src/models/Tour.js';
import TourAvailability from './src/models/TourAvailability.js';
import { getAvailabilityForRangeWithTimes } from './src/services/availability.service.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goa-tours';

async function check() {
    await mongoose.connect(MONGO_URI);
    let output = 'Connected to DB\n';

    const tours = await Tour.find({});
    output += `Found ${tours.length} tours\n`;

    for (const tour of tours) {
        output += `\nTOUR: "${tour.name}" (ID: ${tour._id})\n`;
        output += `  MaxGroupSize: ${tour.maxGroupSize}\n`;

        const count = await TourAvailability.countDocuments({ tourId: tour._id });
        output += `  Records in DB: ${count}\n`;

        if (count > 0) {
            const recs = await TourAvailability.find({ tourId: tour._id }).limit(5);
            recs.forEach(r => {
                output += `    Record: ${r.date.toISOString().slice(0, 10)}, Total: ${r.totalSlots}, Booked: ${r.bookedSlots}, Active: ${r.isActive}\n`;
            });
        }

        // Check service logic output
        const today = new Date();
        const end = new Date();
        end.setMonth(end.getMonth() + 3);

        try {
            const range = await getAvailabilityForRangeWithTimes(tour._id, today.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
            const available = range.filter(d => d.availableSlots > 0);

            output += `  Service returns: ${range.length} days total, ${available.length} AVAILABLE.\n`;
            if (available.length > 0) {
                output += `  First Available: ${available[0].date} (Slots: ${available[0].availableSlots})\n`;
            } else {
                output += `  NO AVAILABILITY! First range item: ${range[0] ? JSON.stringify(range[0]) : 'None'}\n`;
            }
        } catch (e) {
            output += `  Service error: ${e.message}\n`;
        }
        output += '-'.repeat(40) + '\n';
    }

    await mongoose.disconnect();
    fs.writeFileSync('debug_output.txt', output);
    console.log('Done writing to debug_output.txt');
}

check();
