// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const {
    recordPayment,
    getPayments,
    getPaymentById,
    deactivatePayment,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.get('/:id', protect, authorize(['BUYER_ADMIN', 'COOP_ADMIN', 'SYSTEM_ADMIN']), getPaymentById);
router.patch('/:id/deactivate', protect, authorize(['BUYER_ADMIN', 'COOP_ADMIN', 'SYSTEM_ADMIN']), deactivatePayment);

module.exports = router;
