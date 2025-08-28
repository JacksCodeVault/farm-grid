// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All order routes are protected
router.use(protect);

router.route('/')
    .post(placeOrder)
    .get(getOrders);

router.route('/:id')
    .get(getOrderById)
    .put(updateOrder)
    .delete(deleteOrder);

module.exports = router;
