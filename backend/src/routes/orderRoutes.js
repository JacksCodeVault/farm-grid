// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getOrders,
    getOrderById,
    deactivateOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.get('/:id', protect, authorize(['BUYER_ADMIN', 'COOP_ADMIN', 'SYSTEM_ADMIN']), getOrderById);
router.patch('/:id/deactivate', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN']), deactivateOrder);

module.exports = router;
