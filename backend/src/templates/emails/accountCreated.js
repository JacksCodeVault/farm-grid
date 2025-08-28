const accountCreatedEmail = (username, email, password) => `
    <h1>Your FarmGrid Account Has Been Created!</h1>
    <p>Dear ${username},</p>
    <p>Your account for FarmGrid has been successfully created. Here are your login details:</p>
    <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
    </ul>
    <p>We recommend that you change your password after your first login for security reasons.</p>
    <p>You can log in to your account here: <a href="${process.env.CORS_ORIGIN}">FarmGrid Login</a></p>
    <p>Best regards,</p>
    <p>The FarmGrid Team</p>
`;

module.exports = accountCreatedEmail;
