// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db/database');
const config = require('../config/config');
const { sendOtpToUser, verifyOtp: verifyOtpService, generateOtpSecret } = require('../services/otpService');
const { sendWelcomeEmail, sendOtpEmail, sendPasswordResetEmail, sendAccountCreatedEmail } = require('../services/emailService');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    const { name, email, password, phone_number, role, organization_id } = req.body;

    if (!name || !email || !password || !phone_number || !role) { // phone_number is now required
        return res.status(400).json({ message: 'Please enter all required fields: name, email, password, phone_number, role' });
    }

    // Basic role validation
    const allowedRoles = ['SYSTEM_ADMIN', 'BOARD_MEMBER', 'COOP_ADMIN', 'BUYER_ADMIN', 'FIELD_OPERATOR'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: `Invalid role. Allowed roles are: ${allowedRoles.join(', ')}` });
    }

    // Check if user exists
    const userExists = await db('users').where({ email }).first();
    if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const [userId] = await db('users').insert({
            name,
            email,
            password: hashedPassword,
            phone_number: phone_number || null, // phone_number is optional
            role,
            organization_id: organization_id || null, // organization_id is optional
            is_active: true,
        });

        const newUser = await db('users').where({ id: userId }).first();

        // Send account created email with password
        await sendAccountCreatedEmail(newUser.email, newUser.name, newUser.email, password); // Pass the original password

        res.status(201).json({
            message: 'User registered successfully. Account details sent to email.',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for user email
    const user = await db('users').where({ email }).first();

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.is_active) {
        return res.status(401).json({ message: 'Account is inactive. Please contact support.' });
    }

    if (await bcrypt.compare(password, user.password)) {
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Request password reset
// @route   POST /api/auth/request-password-reset
// @access  Public
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Please provide an email address' });
    }

    const user = await db('users').where({ email }).first();

    if (!user) {
        // For security, always respond with a generic message
        return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await db('users').where({ id: user.id }).update({
        password_reset_token: resetToken,
        password_reset_expires: resetExpires,
    });

    const resetLink = `${config.cors.origin}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Please provide a token and new password' });
    }

    const user = await db('users')
        .where({ password_reset_token: token })
        .andWhere('password_reset_expires', '>', new Date())
        .first();

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db('users').where({ id: user.id }).update({
        password: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
    });

    res.status(200).json({ message: 'Password has been reset successfully' });
};

// @desc    Request OTP for verification (e.g., email or phone)
// @route   POST /api/auth/request-otp
// @access  Public
const requestOtp = async (req, res) => {
    const { email, type } = req.body; // type can be 'email' or 'sms'

    if (!email || !type) {
        return res.status(400).json({ message: 'Please provide an email and type (email/sms)' });
    }

    const user = await db('users').where({ email }).first();

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const otpSecret = generateOtpSecret();
    await db('users').where({ id: user.id }).update({ otp_secret: otpSecret });

    if (type === 'email') {
        await sendOtpEmail(user.email, otpSecret); // Using otpSecret as the OTP for now
        res.status(200).json({ message: 'OTP sent to your email' });
    } else if (type === 'sms' && user.phone_number) {
        await sendOtpToUser(user.phone_number, 'sms', otpSecret); // Assuming otpService can take an OTP
        res.status(200).json({ message: 'OTP sent to your phone number' });
    } else {
        res.status(400).json({ message: 'Invalid OTP type or missing phone number for SMS' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtpController = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Please provide email and OTP' });
    }

    const user = await db('users').where({ email }).first();

    if (!user || !user.otp_secret) {
        return res.status(400).json({ message: 'Invalid request or OTP not generated' });
    }

    const isOtpValid = verifyOtpService(user.otp_secret, otp); // Using the imported service function

    if (isOtpValid) {
        // Clear OTP secret after successful verification
        await db('users').where({ id: user.id }).update({ otp_secret: null });
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid or expired OTP' });
    }
};

// @desc    Request passwordless login link
// @route   POST /api/auth/passwordless-login-request
// @access  Public

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    // req.user is set by the protect middleware
    res.status(200).json(req.user);
};

// @desc    Get admin dashboard data
// @route   GET /api/auth/admin-dashboard
// @access  Private/Admin
const getAdminDashboard = async (req, res) => {
    // This is a placeholder. In a real app, you'd fetch relevant admin data.
    res.status(200).json({
        message: `Welcome to the Admin Dashboard, ${req.user.name}!`,
        user: req.user,
        data: 'Some sensitive admin data here.',
    });
};

// @desc    OTP Login
// @route   POST /api/auth/otp-login
// @access  Public
const otpLogin = async (req, res) => {
    const { identifier, otp, type } = req.body; // identifier can be email or phone_number

    if (!identifier || !otp || !type) {
        return res.status(400).json({ message: 'Please provide identifier, OTP, and type (email/sms)' });
    }

    let user;
    if (type === 'email') {
        user = await db('users').where({ email: identifier }).first();
    } else if (type === 'sms') {
        user = await db('users').where({ phone_number: identifier }).first();
    } else {
        return res.status(400).json({ message: 'Invalid OTP type. Must be email or sms.' });
    }

    if (!user || !user.otp_secret) {
        return res.status(400).json({ message: 'Invalid request or OTP not generated' });
    }

    const isOtpValid = verifyOtpService(user.otp_secret, otp);

    if (isOtpValid) {
        // Clear OTP secret after successful login
        await db('users').where({ id: user.id }).update({ otp_secret: null });
        res.json({
            message: 'Successfully logged in via OTP',
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } else {
        res.status(400).json({ message: 'Invalid or expired OTP' });
    }
};

module.exports = {
    register,
    login,
    requestPasswordReset,
    resetPassword,
    requestOtp,
    verifyOtp: verifyOtpController,
    otpLogin,
    getProfile,
    getAdminDashboard,
};
