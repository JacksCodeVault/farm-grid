// src/controllers/userController.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../db/database');
const config = require('../config/config');
const { sendPasswordResetEmail } = require('../services/emailService');

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
    // req.user is set by the protect middleware
    if (req.user) {
        const { id, name, email, role, organization_id } = req.user;
        res.status(200).json({
            id,
            name,
            email,
            role,
            organization_id,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Create new user
// @route   POST /api/v1/users
// @access  Private/Admin
const createUser = async (req, res) => {
    const { name, email, phone_number, role, organization_id } = req.body;
    const requestingUser = req.user; // User making the request (from protect middleware)

    // 1. Input Validation
    if (!name || !email || !phone_number || !role) {
        return res.status(400).json({ message: 'Please enter all required fields: name, email, phone_number, role' });
    }

    // Basic role validation for the *new* user being created
    const allowedNewUserRoles = ['COOP_ADMIN', 'BUYER_ADMIN', 'FIELD_OPERATOR'];
    if (!allowedNewUserRoles.includes(role)) {
        return res.status(400).json({ message: `Invalid role for new user. Allowed roles are: ${allowedNewUserRoles.join(', ')}` });
    }

    // SYSTEM_ADMIN cannot be created via this API
    if (role === 'SYSTEM_ADMIN') {
        return res.status(403).json({ message: 'SYSTEM_ADMIN accounts cannot be created via this API.' });
    }

    // 2. Authorization based on requesting user's role
    if (requestingUser.role === 'SYSTEM_ADMIN') {
        // SYSTEM_ADMIN can create COOP_ADMIN, BUYER_ADMIN, FIELD_OPERATOR for any organization
        if (!organization_id && (role === 'COOP_ADMIN' || role === 'BUYER_ADMIN' || role === 'FIELD_OPERATOR')) {
            return res.status(400).json({ message: 'Organization ID is required for COOP_ADMIN, BUYER_ADMIN, and FIELD_OPERATOR roles.' });
        }
    } else if (requestingUser.role === 'COOP_ADMIN') {
        // COOP_ADMIN can only create FIELD_OPERATOR within their own organization
        if (role !== 'FIELD_OPERATOR') {
            return res.status(403).json({ message: 'COOP_ADMIN can only create FIELD_OPERATOR accounts.' });
        }
        if (organization_id && organization_id !== requestingUser.organization_id) {
            return res.status(403).json({ message: 'COOP_ADMIN can only create FIELD_OPERATOR accounts within their own organization.' });
        }
        // Automatically assign the requesting COOP_ADMIN's organization_id
        req.body.organization_id = requestingUser.organization_id;
    } else {
        // Other roles are not authorized to create users via this endpoint
        return res.status(403).json({ message: 'Not authorized to create users.' });
    }

    // Check if user exists
    const userExists = await db('users').where({ email }).first();
    if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate a strong random password
    const randomPassword = crypto.randomBytes(16).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    try {
        const [userId] = await db('users').insert({
            name,
            email,
            password: hashedPassword,
            phone_number,
            role,
            organization_id: req.body.organization_id, // Use potentially updated organization_id
            is_active: true,
        });

        const newUser = await db('users').where({ id: userId }).first();

        // Generate a password reset token for the new user
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

        await db('users').where({ id: newUser.id }).update({
            password_reset_token: resetToken,
            password_reset_expires: resetExpires,
        });

        const resetLink = `${config.cors.origin}/reset-password?token=${resetToken}`;
        await sendPasswordResetEmail(newUser.email, resetLink);

        res.status(201).json({
            message: `User ${newUser.role} registered successfully. A password reset link has been sent to their email.`,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                organization_id: newUser.organization_id,
            },
        });
    } catch (error) {
        console.error('Error during user creation:', error);
        res.status(500).json({ message: 'Server error during user creation' });
    }
};

module.exports = {
    getMe,
    createUser,
};
