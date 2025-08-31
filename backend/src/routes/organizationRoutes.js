const express = require('express');
const router = express.Router();
const { createOrganization, getOrganizations, getOrganizationById, updateOrganization, deleteOrganization } = require('../controllers/organizationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// SYSTEM_ADMIN can create organizations
router.post('/', protect, authorize(['SYSTEM_ADMIN']), createOrganization);
router.get('/', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER', 'BUYER_ADMIN']), getOrganizations);
router.get('/:id', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER', 'BUYER_ADMIN']), getOrganizationById);
router.patch('/:id', protect, authorize(['SYSTEM_ADMIN']), updateOrganization);
router.delete('/:id', protect, authorize(['SYSTEM_ADMIN']), deleteOrganization);

module.exports = router;
