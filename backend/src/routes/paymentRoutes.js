// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const {
    recordPayment,
    getPayments,
    getPaymentById,
    updatePayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// All payment routes are protected
router.use(protect);

router.route('/')
    .post(recordPayment)
    .get(getPayments);

router.route('/:id')
    .get(getPaymentById)
    .put(updatePayment);

module.exports = router;
