// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const config = require('../config/config');
const { sendOtpToUser, verifyOtp } = require('../services/otpService');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: '1h',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, phone_number, role, organization_id } = req.body;

    if (!name || !email || !password || !phone_number || !role || !organization_id) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if user exists
    const userExists = await db('users').where({ email }).first();
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const [userId] = await db('users').insert({
            name,
            email,
            password: hashedPassword,
            phone_number,
            role,
            organization_id,
        });

        // Send OTP to the user's phone number
        await sendOtpToUser(phone_number, 'sms');

        res.status(201).json({
            message: 'User registered successfully. OTP sent to phone number for verification.',
            user: {
                id: userId,
                name,
                email,
                phone_number,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyUserOtp = async (req, res) => {
    const { identifier, otp } = req.body; // identifier can be phone_number or email

    if (!identifier || !otp) {
        return res.status(400).json({ message: 'Please provide identifier and OTP' });
    }

    const isOtpValid = verifyOtp(identifier, otp);

    if (isOtpValid) {
        // Optionally, update user status to 'verified' in the database
        // await db('users').where({ phone_number: identifier }).update({ is_verified: true });
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid or expired OTP' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await db('users').where({ email }).first();

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

module.exports = {
    registerUser,
    verifyUserOtp,
    loginUser,
};
