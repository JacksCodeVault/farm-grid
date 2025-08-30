// src/routes/farmerRoutes.js
const express = require('express');
const router = express.Router();
const {
    registerFarmer,
    getFarmers,
    getFarmerById,
    deactivateFarmer,
} = require('../controllers/farmerController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.get('/:id', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN']), getFarmerById);
router.patch('/:id/deactivate', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN']), deactivateFarmer);

module.exports = router;
