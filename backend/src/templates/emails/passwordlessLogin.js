const passwordlessLoginEmail = (loginLink) => `
    <h1>Passwordless Login to FarmGrid</h1>
    <p>You have requested a passwordless login to your FarmGrid account.</p>
    <p>Please click on the link below to log in instantly:</p>
    <p><a href="${loginLink}">Log In to FarmGrid</a></p>
    <p>This link will expire shortly. If you did not request this, please ignore this email.</p>
    <p>Best regards,</p>
    <p>The FarmGrid Team</p>
`;

module.exports = passwordlessLoginEmail;
