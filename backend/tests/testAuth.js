require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:3333/api/auth';
const TEST_EMAIL = 'ojangoh2@outlook.com';
const TEST_PASSWORD = 'password123'; // As requested by the user
const TEST_USERNAME = 'Jack Ojango';
const TEST_ROLE = 'SYSTEM_ADMIN';
const TEST_PHONE_NUMBER = '+254712345678'; // Required for registration now

const db = require('../src/db/database'); // Import db for testing

let authToken = '';
let otpValue = '';

const runTests = async () => {
    console.log('--- Starting Authentication System Tests ---');

    // 1. Register User
    console.log('\n--- Test: Register User ---');
    try {
        const res = await axios.post(`${API_URL}/register`, {
            name: TEST_USERNAME,
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            phone_number: TEST_PHONE_NUMBER,
            role: TEST_ROLE,
        });
        console.log('Register Success:', res.data);
    } catch (error) {
        console.error('Register Failed:', error.response ? error.response.data : error.message);
        if (error.response && error.response.data.message === 'User already exists with this email') {
            console.log('User already exists, proceeding with login.');
        } else {
            return;
        }
    }

    // 2. Login User (Password-based)
    console.log('\n--- Test: Login User (Password-based) ---');
    try {
        const res = await axios.post(`${API_URL}/login`, {
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });
        authToken = res.data.token;
        console.log('Login Success:', res.data);
    } catch (error) {
        console.error('Login Failed:', error.response ? error.response.data : error.message);
        return;
    }

    // 3. Request Password Reset
    console.log('\n--- Test: Request Password Reset ---');
    try {
        const res = await axios.post(`${API_URL}/request-password-reset`, {
            email: TEST_EMAIL,
        });
        console.log('Request Password Reset Success:', res.data);
    } catch (error) {
        console.error('Request Password Reset Failed:', error.response ? error.response.data : error.message);
    }

    // 4. Request OTP (Email)
    console.log('\n--- Test: Request OTP (Email) ---');
    try {
        const res = await axios.post(`${API_URL}/request-otp`, {
            email: TEST_EMAIL,
            type: 'email',
        });
        console.log('Request OTP (Email) Success:', res.data);

        // Retrieve the actual OTP from the database
        const user = await db('users').where({ email: TEST_EMAIL }).first();
        if (user && user.otp_secret) {
            otpValue = user.otp_secret;
            console.log(`Retrieved OTP from DB: ${otpValue}`);
        } else {
            console.error('Failed to retrieve OTP from database.');
            return;
        }
    } catch (error) {
        console.error('Request OTP (Email) Failed:', error.response ? error.response.data : error.message);
        return;
    }

    // 5. OTP Login (Email)
    console.log('\n--- Test: OTP Login (Email) ---');
    try {
        const res = await axios.post(`${API_URL}/otp-login`, {
            identifier: TEST_EMAIL,
            otp: otpValue,
            type: 'email',
        });
        console.log('OTP Login (Email) Success:', res.data);
        authToken = res.data.token;
    } catch (error) {
        console.error('OTP Login (Email) Failed:', error.response ? error.response.data : error.message);
        return;
    }

    // 6. Access Protected Route (Profile)
    console.log('\n--- Test: Access Protected Profile Route ---');
    try {
        const res = await axios.get(`${API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        console.log('Access Profile Success:', res.data);
    } catch (error) {
        console.error('Access Profile Failed:', error.response ? error.response.data : error.message);
    }

    // 7. Access Protected Route (Admin Dashboard - with correct role)
    console.log('\n--- Test: Access Protected Admin Dashboard Route (Correct Role) ---');
    try {
        const res = await axios.get(`${API_URL}/admin-dashboard`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        console.log('Access Admin Dashboard Success:', res.data);
    } catch (error) {
        console.error('Access Admin Dashboard Failed:', error.response ? error.response.data : error.message);
    }

    console.log('\n--- Authentication System Tests Complete ---');
};

runTests();
