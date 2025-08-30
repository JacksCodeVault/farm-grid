require('dotenv').config();
const axios = require('axios');

const API_BASE = 'http://localhost:3333/api';
const TEST_EMAIL = 'ojangoh2@outlook.com';
const TEST_PASSWORD = 'password123';
const TEST_NAME = 'Jack Ojango';
const TEST_ROLE = 'SYSTEM_ADMIN';
const TEST_PHONE = '+254712345678';

let authToken = '';

const runApiTests = async () => {
  console.log('--- API Endpoint Tests ---');

  // 1. Login
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    authToken = res.data.token;
    console.log('Login Success:', res.data);
  } catch (error) {
    console.error('Login Failed:', error.response ? error.response.data : error.message);
    return;
  }

  // 2. Request Password Reset
  try {
    const res = await axios.post(`${API_BASE}/auth/request-password-reset`, {
      email: TEST_EMAIL,
    });
    console.log('Request Password Reset:', res.data);
  } catch (error) {
    console.error('Request Password Reset Failed:', error.response ? error.response.data : error.message);
  }

  // 3. Request OTP
  try {
    const res = await axios.post(`${API_BASE}/auth/request-otp`, {
      email: TEST_EMAIL,
      type: 'email',
    });
    console.log('Request OTP:', res.data);
  } catch (error) {
    console.error('Request OTP Failed:', error.response ? error.response.data : error.message);
  }

  // 4. Verify OTP (simulate, as OTP is not returned)
  // Skipped unless you want to fetch OTP from DB

  // 5. OTP Login
  try {
    const res = await axios.post(`${API_BASE}/auth/otp-login`, {
      identifier: TEST_EMAIL,
      otp: '123456', // Replace with actual OTP if available
      type: 'email',
    });
    console.log('OTP Login:', res.data);
  } catch (error) {
    console.error('OTP Login Failed:', error.response ? error.response.data : error.message);
  }

  // 6. Refresh Token
  try {
    const res = await axios.post(`${API_BASE}/auth/refresh-token`, {}, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Refresh Token:', res.data);
  } catch (error) {
    console.error('Refresh Token Failed:', error.response ? error.response.data : error.message);
  }

  // 7. Get Profile
  try {
    const res = await axios.get(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Profile:', res.data);
  } catch (error) {
    console.error('Profile Failed:', error.response ? error.response.data : error.message);
  }

  // 8. Get Admin Dashboard
  try {
    const res = await axios.get(`${API_BASE}/auth/admin-dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Admin Dashboard:', res.data);
  } catch (error) {
    console.error('Admin Dashboard Failed:', error.response ? error.response.data : error.message);
  }

  // 9. Create User
  try {
    const res = await axios.post(`${API_BASE}/users`, {
      name: 'Test User',
      email: 'testuser@example.com',
      phone_number: '+254700000000',
      role: 'COOP_ADMIN',
      organization_id: 1,
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Create User:', res.data);
  } catch (error) {
    console.error('Create User Failed:', error.response ? error.response.data : error.message);
  }

  // 10. Get Me
  try {
    const res = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Get Me:', res.data);
  } catch (error) {
    console.error('Get Me Failed:', error.response ? error.response.data : error.message);
  }

  // 11. Get Farmers
  try {
    const res = await axios.get(`${API_BASE}/farmers`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Farmers:', res.data);
  } catch (error) {
    console.error('Get Farmers Failed:', error.response ? error.response.data : error.message);
  }

  // 12. Create Farmer
  try {
    const res = await axios.post(`${API_BASE}/farmers`, {
      first_name: 'Jane',
      last_name: 'Doe',
      phone_number: '+254799999999',
      cooperative_id: 1,
      village_id: 1,
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Create Farmer:', res.data);
  } catch (error) {
    console.error('Create Farmer Failed:', error.response ? error.response.data : error.message);
  }

  // 13. Get Farmer by ID
  try {
    const res = await axios.get(`${API_BASE}/farmers/1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Farmer by ID:', res.data);
  } catch (error) {
    console.error('Farmer by ID Failed:', error.response ? error.response.data : error.message);
  }

  // 14. Update Farmer
  try {
    const res = await axios.put(`${API_BASE}/farmers/1`, {
      first_name: 'Jane',
      last_name: 'Doe',
      phone_number: '+254799999999',
      cooperative_id: 1,
      village_id: 1,
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Update Farmer:', res.data);
  } catch (error) {
    console.error('Update Farmer Failed:', error.response ? error.response.data : error.message);
  }

  // 15. Delete Farmer
  try {
    const res = await axios.delete(`${API_BASE}/farmers/1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Delete Farmer:', res.data);
  } catch (error) {
    console.error('Delete Farmer Failed:', error.response ? error.response.data : error.message);
  }

  // 16. Get Collections
  try {
    const res = await axios.get(`${API_BASE}/collections`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Collections:', res.data);
  } catch (error) {
    console.error('Get Collections Failed:', error.response ? error.response.data : error.message);
  }

  // 17. Create Collection
  try {
    const res = await axios.post(`${API_BASE}/collections`, {
      farmer_id: 1,
      commodity_id: 1,
      quantity: 10.5,
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Create Collection:', res.data);
  } catch (error) {
    console.error('Create Collection Failed:', error.response ? error.response.data : error.message);
  }

  // 18. Get Collection by ID
  try {
    const res = await axios.get(`${API_BASE}/collections/1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Collection by ID:', res.data);
  } catch (error) {
    console.error('Collection by ID Failed:', error.response ? error.response.data : error.message);
  }

  // 19. Update Collection
  try {
    const res = await axios.put(`${API_BASE}/collections/1`, {
      farmer_id: 1,
      commodity_id: 1,
      quantity: 20.5,
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Update Collection:', res.data);
  } catch (error) {
    console.error('Update Collection Failed:', error.response ? error.response.data : error.message);
  }

  // 20. Delete Collection
  try {
    const res = await axios.delete(`${API_BASE}/collections/1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Delete Collection:', res.data);
  } catch (error) {
    console.error('Delete Collection Failed:', error.response ? error.response.data : error.message);
  }

  // 21. Get Orders
  try {
    const res = await axios.get(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Orders:', res.data);
  } catch (error) {
    console.error('Get Orders Failed:', error.response ? error.response.data : error.message);
  }

  // 22. Create Order
  try {
    const res = await axios.post(`${API_BASE}/orders`, {
      seller_id: 1,
      commodity_id: 1,
      requested_quantity: 5,
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Create Order:', res.data);
  } catch (error) {
    console.error('Create Order Failed:', error.response ? error.response.data : error.message);
  }

  // 23. Get Order by ID
  try {
    const res = await axios.get(`${API_BASE}/orders/1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Order by ID:', res.data);
  } catch (error) {
    console.error('Order by ID Failed:', error.response ? error.response.data : error.message);
  }

  // 24. Update Order
  try {
    const res = await axios.put(`${API_BASE}/orders/1`, {
      seller_id: 1,
      commodity_id: 1,
      requested_quantity: 10,
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Update Order:', res.data);
  } catch (error) {
    console.error('Update Order Failed:', error.response ? error.response.data : error.message);
  }

  // 25. Delete Order
  try {
    const res = await axios.delete(`${API_BASE}/orders/1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Delete Order:', res.data);
  } catch (error) {
    console.error('Delete Order Failed:', error.response ? error.response.data : error.message);
  }

  // 26. Get Payments
  try {
    const res = await axios.get(`${API_BASE}/payments`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Payments:', res.data);
  } catch (error) {
    console.error('Get Payments Failed:', error.response ? error.response.data : error.message);
  }

  // 27. Create Payment
  try {
    const res = await axios.post(`${API_BASE}/payments`, {
      delivery_id: 1,
      amount: 1000,
      transaction_reference: 'TX123456',
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Create Payment:', res.data);
  } catch (error) {
    console.error('Create Payment Failed:', error.response ? error.response.data : error.message);
  }

  // 28. Get Payment by ID
  try {
    const res = await axios.get(`${API_BASE}/payments/1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Payment by ID:', res.data);
  } catch (error) {
    console.error('Payment by ID Failed:', error.response ? error.response.data : error.message);
  }

  // 29. Update Payment
  try {
    const res = await axios.put(`${API_BASE}/payments/1`, {
      delivery_id: 1,
      amount: 2000,
      transaction_reference: 'TX654321',
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Update Payment:', res.data);
  } catch (error) {
    console.error('Update Payment Failed:', error.response ? error.response.data : error.message);
  }

  // 30. Delete Payment
  try {
    const res = await axios.delete(`${API_BASE}/payments/1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Delete Payment:', res.data);
  } catch (error) {
    console.error('Delete Payment Failed:', error.response ? error.response.data : error.message);
  }

  // 31. Webhook SMS
  try {
    const res = await axios.post(`${API_BASE}/webhooks/sms/incoming`, {
      from: '+254712345678',
      text: 'COLLECT farmer_id 1 quantity 10 commodity_id 1',
    });
    console.log('Webhook SMS:', res.data);
  } catch (error) {
    console.error('Webhook SMS Failed:', error.response ? error.response.data : error.message);
  }

  console.log('--- API Endpoint Tests Complete ---');
};

runApiTests();
