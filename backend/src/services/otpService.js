// src/services/otpService.js
const { sendSms } = require('./smsService');
const { sendOtpEmail } = require('./emailService');

// This service will now primarily handle OTP generation and verification logic,
// while the actual sending is delegated to emailService or smsService.

const generateOtpSecret = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// This verifyOtp function is for comparing the provided OTP with the stored secret
const verifyOtp = (storedSecret, providedOtp) => {
    return storedSecret === providedOtp;
};

// This function is for sending OTPs, it will use the emailService or smsService
const sendOtpToUser = async (userIdentifier, type = 'sms', otp) => {
    if (!otp) {
        console.error('OTP must be provided to sendOtpToUser');
        return false;
    }

    if (type === 'sms') {
        // Assuming sendSms takes identifier and otp
        return sendSms(userIdentifier, otp);
    } else if (type === 'email') {
        // sendOtpEmail already handles subject and template
        return sendOtpEmail(userIdentifier, otp);
    }
    return false;
};

module.exports = {
    generateOtpSecret,
    verifyOtp,
    sendOtpToUser,
};
