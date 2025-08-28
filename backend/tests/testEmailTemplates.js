require('dotenv').config();
const { sendWelcomeEmail, sendOtpEmail, sendPasswordResetEmail, sendPasswordlessLoginEmail } = require('../src/services/emailService');

const testEmailTemplates = async () => {
    const testEmailAddress = 'ojangoh2@outlook.com';

    console.log('--- Testing Welcome Email ---');
    const welcomeSuccess = await sendWelcomeEmail(testEmailAddress, 'John Doe');
    if (welcomeSuccess) {
        console.log('Welcome email sent successfully!');
    } else {
        console.log('Failed to send welcome email.');
    }

    console.log('\n--- Testing OTP Email ---');
    const otpSuccess = await sendOtpEmail(testEmailAddress, '123456');
    if (otpSuccess) {
        console.log('OTP email sent successfully!');
    } else {
        console.log('Failed to send OTP email.');
    }

    console.log('\n--- Testing Password Reset Email ---');
    const resetLink = 'http://localhost:5173/reset-password?token=somefaketoken123';
    const passwordResetSuccess = await sendPasswordResetEmail(testEmailAddress, resetLink);
    if (passwordResetSuccess) {
        console.log('Password reset email sent successfully!');
    } else {
        console.log('Failed to send password reset email.');
    }

    console.log('\n--- Testing Passwordless Login Email ---');
    const loginLink = 'http://localhost:5173/passwordless-login?token=anotherfaketoken456';
    const passwordlessLoginSuccess = await sendPasswordlessLoginEmail(testEmailAddress, loginLink);
    if (passwordlessLoginSuccess) {
        console.log('Passwordless login email sent successfully!');
    } else {
        console.log('Failed to send passwordless login email.');
    }
};

testEmailTemplates();
