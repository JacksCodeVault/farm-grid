const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.post('/request-otp', authController.requestOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/otp-login', authController.otpLogin);

const { protect, authorize } = require('../middleware/authMiddleware');

// Protected routes (example)
router.get('/profile', protect, authController.getProfile);
router.get('/admin-dashboard', protect, authorize('SYSTEM_ADMIN', 'BOARD_MEMBER'), authController.getAdminDashboard);

module.exports = router;
