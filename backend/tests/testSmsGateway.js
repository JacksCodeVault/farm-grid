// tests/testSmsGateway.js
require('dotenv').config();
const { 
    sendSms, 
    sendBulkSms, 
    sendOtp, 
    sendWelcomeSms,
    formatPhoneNumber,
    isValidKenyanPhone,
    PHONE_REGEX
} = require('../src/services/smsService');

// Test phone numbers in different formats
const testPhoneNumbers = [
    '+254112407259',
    '254112407259', 
    '0112407259',
    '112407259'
];

async function testPhoneValidation() {
    console.log('🧪 Testing phone number validation and formatting...\n');
    
    testPhoneNumbers.forEach(phone => {
        try {
            const isValid = isValidKenyanPhone(phone);
            const formatted = formatPhoneNumber(phone);
            console.log(`📱 ${phone} -> Valid: ${isValid}, Formatted: ${formatted}`);
        } catch (error) {
            console.log(`❌ ${phone} -> Error: ${error.message}`);
        }
    });
    console.log('---\n');
}

async function testSmsGateway() {
    console.log('🧪 Testing single SMS...');
    const testPhone = process.env.TEST_SMS_PHONE || '+254112407259';
    const testMessage = 'FarmGrid SMS Test: Enhanced service with validation works perfectly!';
    
    try {
        const result = await sendSms(testPhone, testMessage);
        if (result.success) {
            console.log(`✅ SMS sent successfully to ${result.mobile}`);
            console.log(`📋 Message ID: ${result.messageId}`);
        } else {
            console.error('❌ SMS failed:', result.error);
        }
    } catch (err) {
        console.error('❌ Error during SMS test:', err.message);
    }
    console.log('---\n');
}

async function testBulkSmsGateway() {
    console.log('🧪 Testing bulk SMS...');
    const testPhone = process.env.TEST_SMS_PHONE || '+254112407259';
    const smsList = [
        { mobile: testPhone, message: 'Bulk SMS Test 1: Account activated!' },
        { mobile: '0112407259', message: 'Bulk SMS Test 2: Welcome to FarmGrid!' }, // Different format
        { mobile: '254112407259', message: 'Bulk SMS Test 3: Your order is ready!' }
    ];
    
    try {
        const result = await sendBulkSms(smsList);
        if (result.success) {
            console.log(`✅ Bulk SMS sent successfully to ${result.totalSent} recipients`);
            result.responses.forEach((response, index) => {
                console.log(`📋 SMS ${index + 1}: ID ${response.messageid} to ${response.mobile}`);
            });
        } else {
            console.error('❌ Bulk SMS failed:', result.error);
        }
    } catch (err) {
        console.error('❌ Error during bulk SMS test:', err.message);
    }
    console.log('---\n');
}

async function testOtpSms() {
    console.log('🧪 Testing OTP SMS...');
    const testPhone = process.env.TEST_SMS_PHONE || '+254112407259';
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    
    try {
        const result = await sendOtp(testPhone, otp);
        if (result.success) {
            console.log(`✅ OTP SMS sent successfully: ${otp}`);
        } else {
            console.error('❌ OTP SMS failed:', result.error);
        }
    } catch (err) {
        console.error('❌ Error during OTP SMS test:', err.message);
    }
    console.log('---\n');
}

async function testWelcomeSms() {
    console.log('🧪 Testing Welcome SMS...');
    const testPhone = process.env.TEST_SMS_PHONE || '+254112407259';
    
    try {
        const result = await sendWelcomeSms(testPhone, 'John Farmer');
        if (result.success) {
            console.log('✅ Welcome SMS sent successfully');
        } else {
            console.error('❌ Welcome SMS failed:', result.error);
        }
    } catch (err) {
        console.error('❌ Error during Welcome SMS test:', err.message);
    }
    console.log('---\n');
}

async function runAllTests() {
    console.log('🚀 Starting comprehensive SMS gateway tests...\n');
    
    await testPhoneValidation();
    await testSmsGateway();
    await testBulkSmsGateway();
    await testOtpSms();
    await testWelcomeSms();
    
    console.log('✅ All tests completed!');
}

runAllTests();