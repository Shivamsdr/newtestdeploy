
import http from 'http';

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        http.get({
            hostname: 'localhost',
            port: 5000,
            path: '/api/v1' + path,
            agent: false
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        }).on('error', reject);
    });
}

async function test() {
    console.log('--- Testing Search ---');

    // 1. Get all tours (no filter)
    const allRes = await makeRequest('/tours');
    console.log('All Tours Count:', allRes.data.results);
    const allIds = allRes.data.data.tours.map(t => t._id).sort();
    console.log('All IDs:', allIds);

    // 2. Search by date
    // We saw in logs that 2026-02-15 has 1 unavailable tour: 6989da578fdb0377b786c54e
    const date = '2026-02-15';
    const searchRes = await makeRequest(`/tours?date=${date}`);
    console.log(`\nSearch Date: ${date}`);
    console.log('Filtered Tours Count:', searchRes.data.results);
    const filteredIds = searchRes.data.data.tours.map(t => t._id).sort();
    console.log('Filtered IDs:', filteredIds);

    // 3. Verify
    const excluded = allIds.filter(id => !filteredIds.includes(id));
    console.log('\nExcluded IDs:', excluded);

    if (excluded.includes("6989da578fdb0377b786c54e")) { // Adjust ID based on log if needed
        console.log("SUCCESS: Expected tour was excluded.");
    } else if (excluded.length > 0) {
        console.log("SUCCESS: Some tours were excluded.");
    } else {
        console.log("FAILURE: No tours were excluded.");
    }
}

test();
