const otpEmail = (otp) => `
    <h1>Your One-Time Password (OTP)</h1>
    <p>Your OTP for FarmGrid is: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best regards,</p>
    <p>The FarmGrid Team</p>
`;

module.exports = otpEmail;
