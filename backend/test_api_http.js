
import http from 'http';

const tourId = '6976333f8ad21dc233d72cac';
const makeRequest = () => {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/api/v1/tours`,
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log('BODY START:');
            console.log(data.substring(0, 500));
            console.log('BODY END');
            try {
                const json = JSON.parse(data);
                console.log(`Parsed JSON length: ${Array.isArray(json) ? json.length : 'Not array'}`);
            } catch (e) {
                console.log('Error parsing JSON');
            }
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.end();
};

makeRequest();
