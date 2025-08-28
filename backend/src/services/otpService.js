// src/services/otpService.js
const { sendSms } = require('./smsService');
const { sendEmail } = require('./emailService');

// In-memory store for OTPs (for demonstration purposes)
// In a real application, use Redis or a database for production
const otpStore = new Map();

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const setOtp = (identifier, otp) => {
    otpStore.set(identifier, otp);
    // Set a timeout to clear the OTP after a certain period (e.g., 5 minutes)
    setTimeout(() => {
        otpStore.delete(identifier);
    }, 5 * 60 * 1000); // 5 minutes
};

const verifyOtp = (identifier, otp) => {
    const storedOtp = otpStore.get(identifier);
    if (storedOtp && storedOtp === otp) {
        otpStore.delete(identifier); // OTP consumed
        return true;
    }
    return false;
};

const sendOtpToUser = async (userIdentifier, type = 'sms') => {
    const otp = generateOtp();
    setOtp(userIdentifier, otp);

    if (type === 'sms') {
        return sendSms(userIdentifier, otp);
    } else if (type === 'email') {
        const subject = 'Your FarmGrid Verification Code';
        const html = `<p>Your verification code is: <strong>${otp}</strong>. Do not share this code.</p>`;
        return sendEmail(userIdentifier, subject, html);
    }
    return false;
};

module.exports = {
    generateOtp,
    setOtp,
    verifyOtp,
    sendOtpToUser
};
