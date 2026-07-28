const http = require('http');

const API_BASE = 'http://localhost:5000';

const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- Starting API Integration Verification Tests ---');

  // Test 1: Check server health
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    console.log(`[TEST 1] Server Health status: ${res.statusCode} (Expected: 200)`);
    console.log('Response Body:', res.body);
  } catch (error) {
    console.error('[TEST 1 FAILED] Server is not running. Start the backend first.');
    process.exit(1);
  }

  // Test 2: Perform Login
  let cookieHeader = '';
  try {
    const res = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      {
        email: 'admin@gmail.com',
        password: 'admin@123',
      }
    );

    console.log(`[TEST 2] Login Admin status: ${res.statusCode} (Expected: 200)`);
    if (res.statusCode === 200 && res.body.success) {
      console.log('Admin login: SUCCESS');
      // Save cookies for authentication
      if (res.headers['set-cookie']) {
        cookieHeader = res.headers['set-cookie'][0].split(';')[0];
      }
    } else {
      console.error('[TEST 2 FAILED] Login failed. Have you run the seed script?');
      process.exit(1);
    }
  } catch (error) {
    console.error('[TEST 2 FAILED] Error:', error.message);
    process.exit(1);
  }

  // Test 3: Fetch Appointments as Admin
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/appointments',
      method: 'GET',
      headers: {
        Cookie: cookieHeader,
      },
    });

    console.log(`[TEST 3] Fetch All Appointments status: ${res.statusCode} (Expected: 200)`);
    console.log(`Appointments Count: ${res.body.count !== undefined ? res.body.count : 'Failed'}`);
  } catch (error) {
    console.error('[TEST 3 FAILED] Error:', error.message);
  }

  console.log('--- Verification Tests Complete ---');
};

runTests();
