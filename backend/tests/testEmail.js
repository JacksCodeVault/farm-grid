require('dotenv').config();
const { sendEmail } = require('../src/services/emailService');

const testEmail = async () => {
    const to = 'ojangoh2@outlook.com'; // Replace with a real email address for testing
    const subject = 'Test Email from FarmGrid';
    const html = '<h1>Hello from FarmGrid!</h1><p>This is a test email sent using Mailgun SMTP.</p>';

    console.log(`Attempting to send a test email to ${to}`);
    const success = await sendEmail(to, subject, html);

    if (success) {
        console.log('Test email sent successfully!');
    } else {
        console.log('Failed to send test email.');
    }
};

testEmail();
