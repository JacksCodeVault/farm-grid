const passwordResetEmail = (resetLink) => `
    <h1>Password Reset Request</h1>
    <p>You have requested to reset your password for your FarmGrid account.</p>
    <p>Please click on the link below to reset your password:</p>
    <p><a href="${resetLink}">Reset Password</a></p>
    <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
    <p>Best regards,</p>
    <p>The FarmGrid Team</p>
`;

module.exports = passwordResetEmail;
