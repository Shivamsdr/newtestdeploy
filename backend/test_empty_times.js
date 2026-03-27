import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import http from 'http';
import Tour from './src/models/Tour.js';
import TourAvailability from './src/models/TourAvailability.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/walkwithhistory';

async function runTest() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGODB_URI);
            console.log('Connected to DB');
        }

        // 1. Find a tour
        const tour = await Tour.findOne().lean();
        if (!tour) {
            console.log('No tours found.');
            return;
        }
        const tourId = tour._id;
        console.log(`Using tour: ${tour.name} (${tourId})`);

        // 2. Set availability for tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setUTCHours(0, 0, 0, 0);
        const dateStr = tomorrow.toISOString().slice(0, 10);

        console.log(`Setting up test data for date: ${dateStr}`);

        // Update or insert to ensure it has slots but NO times
        await TourAvailability.findOneAndUpdate(
            { tourId: tour._id, date: tomorrow },
            {
                $set: {
                    totalSlots: 20,
                    bookedSlots: 0,
                    isActive: true,
                    times: [] // EMPTY TIMES
                }
            },
            { upsert: true, new: true }
        );
        console.log('Set availability: 20 slots, 0 booked, EMPTY times.');

        // 3. Call public API using http
        const port = process.env.PORT || 5000;
        const url = `http://localhost:${port}/api/v1/availability/${tourId}`;
        console.log(`Fetching from: ${url}`);

        const data = await new Promise((resolve, reject) => {
            http.get(url, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            resolve(JSON.parse(body));
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error(`Status ${res.statusCode}: ${body}`));
                    }
                });
            }).on('error', reject);
        });

        console.log(`API returned ${data.length} dates`);

        // 4. Assert
        const found = data.find(d => d.date === dateStr);

        if (found) {
            console.log('FAIL: Date with empty times was RETURNED by API.');
            console.log('Found item:', JSON.stringify(found));
        } else {
            console.log('PASS: Date with empty times was HIDDEN from API.');
        }

    } catch (err) {
        console.error('Test Error:', err.message);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        // Give time for handle cleanup
        setTimeout(() => {
            console.log('Done.');
        }, 500);
    }
}

runTest();
