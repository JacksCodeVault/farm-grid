// src/controllers/paymentController.js
const db = require('../db/database');

// @desc    Record a bulk payment for a delivery
// @route   POST /api/payments
// @access  Private (BUYER_ADMIN, SYSTEM_ADMIN)
const recordPayment = async (req, res) => {
    console.log('Payment request body:', req.body);
    const { deliveryId, amount, transactionReference } = req.body;
        // Get paid_by from authenticated user session
        const paid_by = req.user && req.user.role ? req.user.role : 'UNKNOWN';
    try {
        // Find delivery
        const delivery = await db('deliveries').where({ id: deliveryId }).first();
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found.' });
        }
        if (delivery.status !== 'VERIFIED') {
            return res.status(400).json({ message: 'Delivery must be VERIFIED before payment.' });
        }
        // Create payment record
        const [paymentId] = await db('payments').insert({
            delivery_id: deliveryId,
            amount: parseFloat(amount),
            transaction_reference: transactionReference,
            paid_by: paid_by,
            paid_to: delivery.seller_id,
            buyer_id: req.user.organization_id,
            payment_date: db.fn.now()
        });
        // Update delivery status to PAID
        await db('deliveries').where({ id: deliveryId }).update({ status: 'PAID', updated_at: db.fn.now() });
        res.status(201).json({ message: 'Payment recorded and delivery marked as PAID.', payment_id: paymentId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error recording payment.' });
    }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Buyer, Seller, System Admin)
const getPayments = async (req, res) => {
    try {
        const payments = await db('payments').select('*');
        res.status(200).json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching payments' });
    }
};

// @desc    Get single payment by ID
// @route   GET /api/payments/:id
// @access  Private (Buyer, Seller, System Admin)
const getPaymentById = async (req, res) => {
    try {
        const payment = await db('payments').where({ id: req.params.id }).first();
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching payment' });
    }
};


// @desc    Deactivate a payment
// @route   PATCH /api/payments/:id/deactivate
// @access  Private (Buyer Admin, Coop Admin, System Admin)
const deactivatePayment = async (req, res) => {
    try {
        const updatedRows = await db('payments')
            .where({ id: req.params.id })
            .update({ is_active: false });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment deactivated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deactivating payment' });
    }
};

module.exports = {
    recordPayment,
    getPayments,
    getPaymentById,
    deactivatePayment,
};
