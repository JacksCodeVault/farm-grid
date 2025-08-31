// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getMe, createUser, getUsers, getUserById, updateUser, deleteUser, getFieldOperatorsForOrg, updateFieldOperator, activateFieldOperator, deactivateFieldOperator } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);

// Get field operators for the requesting COOP_ADMIN's organization
router.get('/field-operators', protect, authorize(['COOP_ADMIN']), getFieldOperatorsForOrg);

// Update field operator details (Coop Admin)
router.patch('/field-operators/:id', protect, authorize(['COOP_ADMIN']), updateFieldOperator);

// Activate/deactivate field operator (Coop Admin)
router.patch('/field-operators/:id/activate', protect, authorize(['COOP_ADMIN']), activateFieldOperator);
router.patch('/field-operators/:id/deactivate', protect, authorize(['COOP_ADMIN']), deactivateFieldOperator);

router.post('/', protect, authorize(['SYSTEM_ADMIN', 'COOP_ADMIN']), createUser);
router.get('/', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER', 'COOP_ADMIN']), getUsers);
router.get('/:id', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER', 'COOP_ADMIN']), getUserById);
router.patch('/:id', protect, authorize(['SYSTEM_ADMIN', 'COOP_ADMIN']), updateUser);
router.delete('/:id', protect, authorize(['SYSTEM_ADMIN', 'COOP_ADMIN']), deleteUser);

module.exports = router;
