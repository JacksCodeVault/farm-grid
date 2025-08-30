// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getOrders,
    getOrderById,
    deactivateOrder,
    getMyOrders,
    acceptOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.get('/', protect, authorize(['BUYER_ADMIN', 'COOP_ADMIN', 'SYSTEM_ADMIN']), getOrders);
router.get('/my', protect, authorize(['BUYER_ADMIN']), getMyOrders);
router.get('/:id', protect, authorize(['BUYER_ADMIN', 'COOP_ADMIN', 'SYSTEM_ADMIN']), getOrderById);
router.patch('/:id/deactivate', protect, authorize(['COOP_ADMIN']), deactivateOrder);
router.post('/', protect, authorize(['BUYER_ADMIN']), placeOrder);
router.patch('/:id/accept', protect, authorize(['COOP_ADMIN']), acceptOrder);

module.exports = router;
