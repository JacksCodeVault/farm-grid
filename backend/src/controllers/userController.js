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
    try {
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
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate a temporary password and hash it
        const tempPassword = crypto.randomBytes(16).toString('hex'); // Generate a random temporary password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);

        // Insert user into database
        const [newUser] = await db('users').insert({
            name,
            email,
            phone_number,
            role,
            organization_id: req.body.organization_id, // Use the potentially updated organization_id
            password: hashedPassword,
            is_active: true, // New users are active by default
            created_at: db.fn.now(),
            updated_at: db.fn.now(),
        }).returning(['id', 'name', 'email', 'role', 'organization_id', 'is_active']);

        // Send password reset email
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetExpires = Date.now() + 3600000; // 1 hour
        await db('users').where({ id: newUser.id }).update({
            password_reset_token: resetToken,
            password_reset_expires: passwordResetExpires,
        });

        const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
        await sendPasswordResetEmail(newUser.email, newUser.name, resetUrl);

        res.status(201).json({
            message: 'User created successfully. Password reset email sent.',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                organization_id: newUser.organization_id,
                is_active: newUser.is_active,
            },
        });
    } catch (error) {
        console.error('Error during user creation:', error);
        res.status(500).json({ message: 'Server error during user creation' });
    }
};

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await db('users').select('id', 'name', 'email', 'role', 'organization_id', 'is_active');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single user by ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db('users').where({ id }).select('id', 'name', 'email', 'role', 'organization_id', 'is_active').first();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user
// @route   PATCH /api/v1/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone_number, role, organization_id, is_active } = req.body;
    const requestingUser = req.user;

    try {
        const userToUpdate = await db('users').where({ id }).first();
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only SYSTEM_ADMIN can update roles and organization_id
        if (requestingUser.role !== 'SYSTEM_ADMIN' && (role || organization_id)) {
            return res.status(403).json({ message: 'Only SYSTEM_ADMIN can update user roles or organization_id.' });
        }

        await db('users').where({ id }).update({
            name: name || userToUpdate.name,
            email: email || userToUpdate.email,
            phone_number: phone_number || userToUpdate.phone_number,
            role: role || userToUpdate.role,
            organization_id: organization_id || userToUpdate.organization_id,
            is_active: is_active !== undefined ? is_active : userToUpdate.is_active,
            updated_at: db.fn.now()
        });

        const updatedUser = await db('users').where({ id }).first();

        if (!updatedUser) {
            return res.status(500).json({ message: 'Failed to retrieve updated user data.' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                organization_id: updatedUser.organization_id,
                is_active: updatedUser.is_active
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCount = await db('users').where({ id }).del();

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get field operators for the requesting COOP_ADMIN's organization
// @route   GET /api/v1/users/field-operators
// @access  Private/CoopAdmin
const getFieldOperatorsForOrg = async (req, res) => {
    try {
        const orgId = req.user.organization_id;
        if (!orgId) {
            return res.status(400).json({ message: 'Organization ID not found for requesting user.' });
        }
        const operators = await db('users')
            .select('id', 'name', 'email', 'phone_number', 'is_active')
            .where({ role: 'FIELD_OPERATOR', organization_id: orgId });
        res.status(200).json(operators);
    } catch (error) {
        console.error('Error fetching field operators:', error);
        res.status(500).json({ message: 'Server error fetching field operators' });
    }
};

// @desc    Update field operator status (activate/deactivate)
// @route   PATCH /api/v1/users/field-operators/:id/status
// @access  Private/CoopAdmin
const updateFieldOperator = async (req, res) => {
    const { id } = req.params;
    const { is_active, name, email, phone_number } = req.body;
    const requestingUser = req.user;

    try {
        const operatorToUpdate = await db('users').where({ id }).first();

        if (!operatorToUpdate) {
            return res.status(404).json({ message: 'Field operator not found' });
        }

        if (operatorToUpdate.role !== 'FIELD_OPERATOR' || operatorToUpdate.organization_id !== requestingUser.organization_id) {
            return res.status(403).json({ message: 'Not authorized to update this user.' });
        }

        // Build update object dynamically
        const updateData = {
            updated_at: db.fn.now()
        };
        if (typeof is_active !== 'undefined') updateData.is_active = is_active;
        if (typeof name !== 'undefined') updateData.name = name;
        if (typeof email !== 'undefined') updateData.email = email;
        if (typeof phone_number !== 'undefined') updateData.phone_number = phone_number;

        await db('users').where({ id }).update(updateData);

        const updatedOperator = await db('users').where({ id }).first();

        res.status(200).json({
            message: 'Field operator updated successfully',
            operator: {
                id: updatedOperator.id,
                name: updatedOperator.name,
                email: updatedOperator.email,
                phone_number: updatedOperator.phone_number,
                is_active: updatedOperator.is_active
            }
        });
    } catch (error) {
        console.error('Error updating field operator:', error);
        res.status(500).json({ message: 'Server error updating field operator' });
    }
};

// @desc    Activate field operator
// @route   PATCH /api/v1/users/field-operators/:id/activate
// @access  Private/CoopAdmin
const activateFieldOperator = async (req, res) => {
    if (!req.body) req.body = {};
    req.body.is_active = true;
    return updateFieldOperator(req, res);
};

// @desc    Deactivate field operator
// @route   PATCH /api/v1/users/field-operators/:id/deactivate
// @access  Private/CoopAdmin
const deactivateFieldOperator = async (req, res) => {
    if (!req.body) req.body = {};
    req.body.is_active = false;
    return updateFieldOperator(req, res);
};


module.exports = {
    getMe,
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getFieldOperatorsForOrg,
    updateFieldOperator,
    activateFieldOperator,
    deactivateFieldOperator,
};
