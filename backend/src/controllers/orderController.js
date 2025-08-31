// src/controllers/orderController.js
const db = require('../db/database');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (Buyer, System Admin)
const placeOrder = async (req, res) => {
    const { seller_id, commodity_id, requested_quantity } = req.body;
    const buyer_id = req.user.organization_id; // Use organization_id for buyer_id
    if (!buyer_id) {
        return res.status(400).json({ message: 'Cannot place order: buyer_id is missing. Please ensure your user is linked to an organization.' });
    }

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

// @desc    Deactivate an order
// @route   PATCH /api/orders/:id/deactivate
// @access  Private (Coop Admin, System Admin)
const deactivateOrder = async (req, res) => {
    try {
        const updatedRows = await db('orders')
            .where({ id: req.params.id })
            .update({ is_active: false });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deactivated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deactivating order' });
    }
};

// @desc    Get all orders for the authenticated buyer
// @route   GET /api/orders/my
// @access  Private (Buyer Admin)
const getMyOrders = async (req, res) => {
    try {
        const buyer_id = req.user.organization_id;
        if (!buyer_id) {
            return res.status(400).json({ message: 'Cannot fetch orders: buyer_id is missing. Please ensure your user is linked to an organization.' });
        }
        const orders = await db('orders').where({ buyer_id }).select('*');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching your orders' });
    }
};

// @desc    Update order details
// @route   PATCH /api/orders/:id
// @access  Private (Coop Admin)
const updateOrder = async (req, res) => {
    const { commodity_id, requested_quantity, status, seller_id } = req.body;
    try {
        const updatedRows = await db('orders')
            .where({ id: req.params.id })
            .update({
                commodity_id,
                requested_quantity: requested_quantity !== undefined ? parseFloat(requested_quantity) : undefined,
                status,
                seller_id
            });
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const updatedOrder = await db('orders').where({ id: req.params.id }).first();
        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating order' });
    }
};

// @desc    Update only the status of an order
// @route   PATCH /api/orders/:id/status
// @access  Private (Coop Admin)
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'Please provide a status value.' });
    }
    try {
        const updatedRows = await db('orders')
            .where({ id: req.params.id })
            .update({ status });
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const updatedOrder = await db('orders').where({ id: req.params.id }).first();
        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating order status' });
    }
};

// @desc    Accept an order and create a delivery
// @route   PATCH /api/orders/:id/accept
// @access  Private (COOP_ADMIN)
const acceptOrder = async (req, res) => {
    const orderId = req.params.id;
    const sellerOrgId = req.user.organization_id;
    const db = require('../db/database');
    try {
        await db.transaction(async trx => {
            // Update order status
            const updatedRows = await trx('orders').where({ id: orderId, seller_id: sellerOrgId, status: 'PENDING' }).update({ status: 'PROCESSING' });
            if (updatedRows === 0) {
                throw new Error('Order not found or not pending, or you are not authorized.');
            }
            // Create delivery record
            const [deliveryId] = await trx('deliveries').insert({
                order_id: orderId,
                seller_id: sellerOrgId,
                status: 'PENDING',
                verified_quantity: null
            });
            res.status(200).json({ message: 'Order accepted and delivery created.', delivery_id: deliveryId });
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message || 'Error accepting order.' });
    }
};

// @desc    Activate an order
// @route   PATCH /api/orders/:id/activate
// @access  Private (Coop Admin, System Admin)
const activateOrder = async (req, res) => {
    try {
        const updatedRows = await db('orders')
            .where({ id: req.params.id })
            .update({ is_active: true });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order activated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error activating order' });
    }
};

module.exports = {
    placeOrder,
    getOrders,
    getOrderById,
    deactivateOrder,
    getMyOrders,
    updateOrder,
    updateOrderStatus,
    acceptOrder,
    activateOrder,
};
