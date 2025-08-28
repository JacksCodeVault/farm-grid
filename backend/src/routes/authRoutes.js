// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, verifyUserOtp, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/verify-otp', verifyUserOtp);
router.post('/login', loginUser);

module.exports = router;
