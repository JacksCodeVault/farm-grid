// src/controllers/orderController.js
const db = require('../db/database');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (Buyer, System Admin)
const placeOrder = async (req, res) => {
    const { seller_id, commodity_id, requested_quantity } = req.body;
    const buyer_id = req.user.organization_id; // Assuming buyer is the user's organization

    if (!seller_id || !commodity_id || !requested_quantity) {
        return res.status(400).json({ message: 'Please provide seller_id, commodity_id, and requested_quantity' });
    }

    try {
        const [orderId] = await db('orders').insert({
            buyer_id,
            seller_id,
            commodity_id,
            requested_quantity: parseFloat(requested_quantity),
            status: 'PENDING',
        });

        res.status(201).json({
            message: 'Order placed successfully',
            order: {
                id: orderId,
                buyer_id,
                seller_id,
                commodity_id,
                requested_quantity,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error placing order' });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Buyer, Seller, System Admin)
const getOrders = async (req, res) => {
    try {
        const orders = await db('orders').select('*');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (Buyer, Seller, System Admin)
const getOrderById = async (req, res) => {
    try {
        const order = await db('orders').where({ id: req.params.id }).first();
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching order' });
    }
};

// @desc    Update order details
// @route   PUT /api/orders/:id
// @access  Private (Seller, System Admin)
const updateOrder = async (req, res) => {
    const { status, requested_quantity } = req.body;

    try {
        const updatedRows = await db('orders')
            .where({ id: req.params.id })
            .update({
                status,
                requested_quantity: requested_quantity ? parseFloat(requested_quantity) : undefined,
            });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating order' });
    }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private (System Admin)
const deleteOrder = async (req, res) => {
    try {
        const deletedRows = await db('orders').where({ id: req.params.id }).del();

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting order' });
    }
};

module.exports = {
    placeOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};
