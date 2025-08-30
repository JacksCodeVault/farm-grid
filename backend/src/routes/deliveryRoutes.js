const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { verifyDelivery, updateDeliveryStatus, adminUpdateDelivery, getSellerDeliveries, getBuyerDeliveries, getAllDeliveries, assignCollectionsToDelivery, getPayoutReport } = require('../controllers/deliveryController');

// PATCH /api/v1/deliveries/:id/verify - Only BUYER_ADMIN can verify their own delivery
router.patch('/:id/verify', protect, authorize(['BUYER_ADMIN']), verifyDelivery);

// PATCH /api/v1/deliveries/:id/status - COOP_ADMIN or SYSTEM_ADMIN can update delivery status
router.patch('/:id/status', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN']), updateDeliveryStatus);

// PATCH /api/v1/deliveries/:id/admin - Only SYSTEM_ADMIN can perform admin updates on deliveries
router.patch('/:id/admin', protect, authorize(['SYSTEM_ADMIN']), adminUpdateDelivery);

// GET /api/v1/deliveries/seller - COOP_ADMIN can view seller deliveries
router.get('/seller', protect, authorize(['COOP_ADMIN']), getSellerDeliveries);

// GET /api/v1/deliveries/buyer - BUYER_ADMIN can view their own deliveries
router.get('/buyer', protect, authorize(['BUYER_ADMIN']), getBuyerDeliveries);

// GET /api/v1/deliveries/all - SYSTEM_ADMIN can view all deliveries
router.get('/all', protect, authorize(['SYSTEM_ADMIN']), getAllDeliveries);

// POST /api/v1/deliveries/:id/assign-collections - COOP_ADMIN can assign collections to a delivery
router.post('/:id/assign-collections', protect, authorize(['COOP_ADMIN']), assignCollectionsToDelivery);

// GET /api/v1/deliveries/:id/payout-report - COOP_ADMIN can view payout breakdown for a delivery
router.get('/:id/payout-report', protect, authorize(['COOP_ADMIN']), getPayoutReport);

module.exports = router;
