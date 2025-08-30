// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getMe, createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);
router.post('/', protect, authorize(['SYSTEM_ADMIN']), createUser);
router.get('/', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER']), getUsers);
router.get('/:id', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER']), getUserById);
router.patch('/:id', protect, authorize(['SYSTEM_ADMIN']), updateUser);
router.delete('/:id', protect, authorize(['SYSTEM_ADMIN']), deleteUser);

module.exports = router;
