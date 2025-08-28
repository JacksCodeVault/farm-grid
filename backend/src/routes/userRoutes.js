// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getMe, createUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);
router.post('/', protect, authorize('SYSTEM_ADMIN', 'COOP_ADMIN'), createUser);

module.exports = router;
