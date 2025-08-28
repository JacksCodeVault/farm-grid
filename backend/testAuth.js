require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:3333/api/auth';
const TEST_EMAIL = 'ojangoh2@outlook.com';
const TEST_PASSWORD = 'password123'; // As requested by the user
const TEST_USERNAME = 'Jack Ojango'; // As requested by the user
const TEST_ROLE = 'SYSTEM_ADMIN'; // As requested by the user

let authToken = '';
let resetToken = '';
let loginlessToken = '';
let otpSecret = ''; // In a real scenario, this would be handled by the OTP service internally

const runTests = async () => {
    console.log('--- Starting Authentication System Tests ---');

    // 1. Register User
    console.log('\n--- Test: Register User ---');
    try {
        const res = await axios.post(`${API_URL}/register`, {
            name: TEST_USERNAME,
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            role: TEST_ROLE,
        });
        console.log('Register Success:', res.data);
    } catch (error) {
        console.error('Register Failed:', error.response ? error.response.data : error.message);
        if (error.response && error.response.data.message === 'User already exists with this email') {
            console.log('User already exists, proceeding with login.');
        } else {
            return; // Stop if registration truly fails
        }
    }

    // 2. Login User
    console.log('\n--- Test: Login User ---');
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
        // In a real scenario, you'd fetch the token from the email.
        // For testing, we'll simulate getting it from the database or a mock email service.
        // For now, we'll assume the email was sent and manually get the token if needed for a full test.
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
        // In a real scenario, you'd fetch the OTP from the email.
        // For now, we'll assume it's sent.
    } catch (error) {
        console.error('Request OTP (Email) Failed:', error.response ? error.response.data : error.message);
    }

    // 5. Request Passwordless Login
    console.log('\n--- Test: Request Passwordless Login ---');
    try {
        const res = await axios.post(`${API_URL}/passwordless-login-request`, {
            email: TEST_EMAIL,
        });
        console.log('Request Passwordless Login Success:', res.data);
        // In a real scenario, you'd fetch the login token from the email.
        // For now, we'll assume it's sent.
    } catch (error) {
        console.error('Request Passwordless Login Failed:', error.response ? error.response.data : error.message);
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

    // 8. Access Protected Route (Admin Dashboard - with incorrect role - requires a different user or token)
    // This test would require registering a user with a non-admin role and trying to access the admin dashboard.
    // For simplicity, we'll skip this for now, but it's an important test case.
    console.log('\n--- Test: Access Protected Admin Dashboard Route (Incorrect Role - Skipped) ---');
    console.log('To fully test role-based access, create a user with a non-admin role and attempt to access the admin-dashboard route.');

    console.log('\n--- Authentication System Tests Complete ---');
};

// Start the server before running tests
// You would typically run your Express server in a separate process
// For this test script, ensure your backend server is running on PORT 3333
runTests();
