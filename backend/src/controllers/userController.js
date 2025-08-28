// src/controllers/userController.js
const db = require('../db/database');

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

module.exports = {
    getMe,
};
