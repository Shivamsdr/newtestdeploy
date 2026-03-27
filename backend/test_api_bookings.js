import http from 'http';

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/bookings',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Status:', res.statusCode);
            if (json.data && json.data.bookings) {
                const privateBookings = json.data.bookings.filter(b => b.bookingType === 'private');
                console.log('Total Bookings via API:', json.data.bookings.length);
                console.log('Private Bookings via API:', privateBookings.length);
                if (privateBookings.length > 0) {
                    console.log('Sample Private Booking from API:', JSON.stringify(privateBookings[0], null, 2));
                } else {
                    console.log('NO PRIVATE BOOKINGS FOUND IN API RESPONSE');
                    // Check if any bookings don't have bookingType
                    const unknown = json.data.bookings.filter(b => !b.bookingType);
                    console.log('Bookings without bookingType:', unknown.length);
                }
            } else {
                console.log('Invalid response structure:', Object.keys(json));
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw data:', data.substring(0, 200));
        }
    });
});

req.on('error', (e) => {
    console.error('Problem with request:', e.message);
});

req.end();
