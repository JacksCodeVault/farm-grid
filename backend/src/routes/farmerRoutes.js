// src/routes/farmerRoutes.js
const express = require('express');
const router = express.Router();
const {
    registerFarmer,
    getFarmers,
    getFarmerById,
    deactivateFarmer,
    updateFarmer,
} = require('../controllers/farmerController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.get('/', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN', 'FIELD_OPERATOR']), getFarmers);
router.get('/:id', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN', 'FIELD_OPERATOR']), getFarmerById);
router.patch('/:id/deactivate', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN']), deactivateFarmer);
router.post('/', protect, authorize(['FIELD_OPERATOR']), registerFarmer);
router.patch('/:id', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN', 'FIELD_OPERATOR', 'BUYER_ADMIN', 'BOARD_MEMBER']), updateFarmer);

module.exports = router;
