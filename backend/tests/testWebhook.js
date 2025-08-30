// tests/testWebhook.js
require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_PHONE = process.env.TEST_SMS_PHONE || '+254112407259';

const testWebhookCommands = async () => {
    const testCases = [
        {
            name: 'Help Command',
            payload: {
                from: TEST_PHONE,
                text: 'HELP'
            }
        },
        {
            name: 'Status Command',
            payload: {
                from: TEST_PHONE,
                text: 'STATUS'
            }
        },
        {
            name: 'Invalid Command',
            payload: {
                from: TEST_PHONE,
                text: 'INVALID_COMMAND'
            }
        },
        {
            name: 'Collect Command (Missing Parameters)',
            payload: {
                from: TEST_PHONE,
                text: 'COLLECT farmer_id 123'
            }
        },
        {
            name: 'Register Farmer Command (Missing Parameters)',
            payload: {
                from: TEST_PHONE,
                text: 'REGISTER_FARMER first_name John'
            }
        }
    ];

    console.log('🧪 Testing webhook commands...\n');

    for (const testCase of testCases) {
        try {
            console.log(`📱 Testing: ${testCase.name}`);
            console.log(`💬 Command: "${testCase.payload.text}"`);
            
            const response = await axios.post(`${BASE_URL}/webhooks/sms/test`, testCase.payload);
            
            console.log(`✅ Status: ${response.status}`);
            console.log(`📋 Response:`, response.data);
            console.log('---\n');
            
            // Add delay between requests
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`❌ Error testing ${testCase.name}:`, error.response?.data || error.message);
            console.log('---\n');
        }
    }
};

// Test webhook health
const testWebhookHealth = async () => {
    try {
        console.log('🏥 Testing webhook health...');
        const response = await axios.get(`${BASE_URL}/webhooks/health`);
        console.log('✅ Webhook health check passed:', response.data);
    } catch (error) {
        console.error('❌ Webhook health check failed:', error.response?.data || error.message);
    }
    console.log('---\n');
};

const runWebhookTests = async () => {
    console.log('🚀 Starting webhook integration tests...\n');
    
    await testWebhookHealth();
    await testWebhookCommands();
    
    console.log('✅ All webhook tests completed!');
};

runWebhookTests();