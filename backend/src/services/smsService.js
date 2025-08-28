// src/services/smsService.js
const config = require('../config/config');

const sendSms = async (to, message) => {
    // Placeholder for SMS sending logic (e.g., Africa's Talking, Twilio)
    console.log(`Sending SMS to ${to}: ${message}`);
    // In a real application, you would integrate with an SMS API here.
    // Example:
    // try {
    //     const response = await axios.post('SMS_PROVIDER_API_ENDPOINT', {
    //         apiKey: config.sms.apiKey,
    //         to,
    //         message
    //     });
    //     console.log('SMS sent successfully:', response.data);
    //     return true;
    // } catch (error) {
    //     console.error('Failed to send SMS:', error);
    //     return false;
    // }
    return true; // Simulate success
};

const sendOtp = async (to, otp) => {
    const message = `Your FarmGrid verification code is: ${otp}. Do not share this code.`;
    return sendSms(to, message);
};

module.exports = {
    sendSms,
    sendOtp
};
