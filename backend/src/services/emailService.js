const nodemailer = require('nodemailer');
const config = require('../config/config');
const welcomeEmailTemplate = require('../templates/emails/welcome');
const otpEmailTemplate = require('../templates/emails/otp');
const passwordResetEmailTemplate = require('../templates/emails/passwordReset');
const accountCreatedEmailTemplate = require('../templates/emails/accountCreated');

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.encryption === 'ssl', // true for 465, false for other ports
    auth: {
        user: config.email.username,
        pass: config.email.password,
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"${config.email.fromName}" <${config.email.fromAddress}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
};

const sendWelcomeEmail = async (to, username) => {
    const subject = 'Welcome to FarmGrid!';
    const html = welcomeEmailTemplate(username);
    return sendEmail(to, subject, html);
};

const sendOtpEmail = async (to, otp) => {
    const subject = 'Your FarmGrid One-Time Password (OTP)';
    const html = otpEmailTemplate(otp);
    return sendEmail(to, subject, html);
};

const sendPasswordResetEmail = async (to, resetLink) => {
    const subject = 'FarmGrid Password Reset Request';
    const html = passwordResetEmailTemplate(resetLink);
    return sendEmail(to, subject, html);
};

const sendAccountCreatedEmail = async (to, username, email, password) => {
    const subject = 'Your FarmGrid Account Details';
    const html = accountCreatedEmailTemplate(username, email, password);
    return sendEmail(to, subject, html);
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendOtpEmail,
    sendPasswordResetEmail,
    sendAccountCreatedEmail,
};
