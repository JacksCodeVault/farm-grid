// src/controllers/paymentController.js
const db = require('../db/database');

// @desc    Record a new payment
// @route   POST /api/payments
// @access  Private (Buyer, System Admin)
const recordPayment = async (req, res) => {
    const { delivery_id, amount, transaction_reference } = req.body;
    const buyer_id = req.user.organization_id; // Assuming buyer is the user's organization

    if (!delivery_id || !amount || !transaction_reference) {
        return res.status(400).json({ message: 'Please provide delivery_id, amount, and transaction_reference' });
    }

    try {
        const [paymentId] = await db('payments').insert({
            delivery_id,
            buyer_id,
            amount: parseFloat(amount),
            transaction_reference,
            status: 'COMPLETED',
        });

        res.status(201).json({
            message: 'Payment recorded successfully',
            payment: {
                id: paymentId,
                delivery_id,
                buyer_id,
                amount,
                transaction_reference,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error recording payment' });
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
