const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', authController.login);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.post('/request-otp', authController.requestOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/otp-login', authController.otpLogin);

// Protected routes
router.post('/refresh-token', protect, authController.refreshToken);
router.get('/profile', protect, authController.getProfile);
router.get('/admin-dashboard', protect, authorize('SYSTEM_ADMIN', 'BOARD_MEMBER'), authController.getAdminDashboard);

module.exports = router;
