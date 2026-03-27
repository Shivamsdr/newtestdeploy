
import fetch from 'node-fetch';

async function test() {
    const tourId = '6976333f8ad21dc233d72cac'; // MastRam from debug output
    const url = `http://localhost:5000/api/v1/availability/${tourId}`;

    console.log(`Fetching ${url}...`);
    try {
        const res = await fetch(url);
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Response length: ${text.length}`);
        console.log(`First 500 chars: ${text.slice(0, 500)}`);

        try {
            const json = JSON.parse(text);
            console.log(`JSON parsed successfully. Array length: ${Array.isArray(json) ? json.length : 'Not an array'}`);
        } catch (e) {
            console.log('Not valid JSON');
        }
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

test();
