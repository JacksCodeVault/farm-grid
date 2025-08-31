const db = require('../db/database');

// @desc    Verify a delivery (BUYER_ADMIN only)
// @route   PATCH /api/v1/deliveries/:id/verify
// @access  Private (BUYER_ADMIN)
const verifyDelivery = async (req, res) => {
    const deliveryId = req.params.id;
    const { verified_quantity } = req.body;
    const buyerOrgId = req.user.organization_id;

    if (!verified_quantity) {
        return res.status(400).json({ message: 'Please provide verified_quantity.' });
    }

    try {
        // Find the delivery and its order
        const delivery = await db('deliveries').where({ id: deliveryId }).first();
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found.' });
        }
        // Find the order and check if it belongs to this buyer
        const order = await db('orders').where({ id: delivery.order_id }).first();
        if (!order || order.buyer_id !== buyerOrgId) {
            return res.status(403).json({ message: 'You are not authorized to verify this delivery.' });
        }
        // Only allow verification if status is DELIVERED
        if (delivery.status !== 'DELIVERED') {
            return res.status(400).json({ message: 'Delivery must be in DELIVERED status to verify.' });
        }
        // Update delivery
        await db('deliveries')
            .where({ id: deliveryId })
            .update({
                verified_quantity: parseFloat(verified_quantity),
                status: 'VERIFIED',
                updated_at: db.fn.now()
            });
        const updatedDelivery = await db('deliveries').where({ id: deliveryId }).first();
        res.status(200).json({ message: 'Delivery verified successfully.', delivery: updatedDelivery });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error verifying delivery.' });
    }
};

// @desc    Update delivery status (COOP_ADMIN only)
// @route   PATCH /api/v1/deliveries/:id/status
// @access  Private (COOP_ADMIN)
const updateDeliveryStatus = async (req, res) => {
    const deliveryId = req.params.id;
    const { status, delivery_date } = req.body;
    const sellerOrgId = req.user.organization_id;
    try {
        const delivery = await db('deliveries').where({ id: deliveryId }).first();
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found.' });
        }
        if (delivery.seller_id !== sellerOrgId && req.user.role !== 'SYSTEM_ADMIN') {
            return res.status(403).json({ message: 'You are not authorized to update this delivery.' });
        }
        await db('deliveries').where({ id: deliveryId }).update({
            status: status || delivery.status,
            delivery_date: delivery_date || delivery.delivery_date,
            updated_at: db.fn.now()
        });
        const updatedDelivery = await db('deliveries').where({ id: deliveryId }).first();
        console.log('[DELIVERED] Delivery result:', updatedDelivery);
        res.status(200).json({ message: 'Delivery updated successfully.', delivery: updatedDelivery });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating delivery.' });
    }
};

// @desc    Admin update delivery (SYSTEM_ADMIN only)
// @route   PATCH /api/v1/deliveries/:id/admin
// @access  Private (SYSTEM_ADMIN)
const adminUpdateDelivery = async (req, res) => {
    const deliveryId = req.params.id;
    const updateFields = req.body;
    if (req.user.role !== 'SYSTEM_ADMIN') {
        return res.status(403).json({ message: 'Only SYSTEM_ADMIN can use this endpoint.' });
    }
    try {
        await db('deliveries').where({ id: deliveryId }).update({ ...updateFields, updated_at: db.fn.now() });
        const updatedDelivery = await db('deliveries').where({ id: deliveryId }).first();
        res.status(200).json({ message: 'Delivery updated by admin.', delivery: updatedDelivery });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating delivery.' });
    }
};

// @desc    Get deliveries for seller (COOP_ADMIN only)
// @route   GET /api/v1/deliveries/seller
// @access  Private (COOP_ADMIN)
const getSellerDeliveries = async (req, res) => {
    const sellerOrgId = req.user.organization_id;
    try {
        const deliveries = await db('deliveries').where({ seller_id: sellerOrgId }).select('*');
        res.status(200).json(deliveries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching deliveries.' });
    }
};

// @desc    Get deliveries for buyer (BUYER_ADMIN only)
// @route   GET /api/v1/deliveries/buyer
// @access  Private (BUYER_ADMIN)
const getBuyerDeliveries = async (req, res) => {
    const buyerOrgId = req.user.organization_id;
    try {
        const orders = await db('orders').where({ buyer_id: buyerOrgId }).select('id');
        const orderIds = orders.map(o => o.id);
        const deliveries = await db('deliveries').whereIn('order_id', orderIds).select('*');
        res.status(200).json(deliveries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching deliveries.' });
    }
};

// @desc    Get all deliveries (SYSTEM_ADMIN only)
// @route   GET /api/v1/deliveries
// @access  Private (SYSTEM_ADMIN)
const getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await db('deliveries').select('*');
        res.status(200).json(deliveries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching deliveries.' });
    }
};

// @desc    Assign collections to a delivery (COOP_ADMIN only)
// @route   PATCH /api/v1/deliveries/:id/collections
// @access  Private (COOP_ADMIN)
const assignCollectionsToDelivery = async (req, res) => {
    const deliveryId = req.params.id;
    const { collection_ids } = req.body; // array of collection IDs
    const sellerOrgId = req.user.organization_id;
    if (!Array.isArray(collection_ids) || collection_ids.length === 0) {
        return res.status(400).json({ message: 'Please provide a non-empty array of collection_ids.' });
    }
    try {
        // Check delivery ownership
        const delivery = await db('deliveries').where({ id: deliveryId }).first();
        if (!delivery || delivery.seller_id !== sellerOrgId) {
            return res.status(403).json({ message: 'You are not authorized to assign collections to this delivery.' });
        }
        // Link each collection
        for (const collection_id of collection_ids) {
            await db('collection_delivery_link').insert({ collection_id, delivery_id: deliveryId });
        }
        res.status(200).json({ message: 'Collections assigned to delivery successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error assigning collections to delivery.' });
    }
};

// @desc    Get payout report for a delivery (COOP_ADMIN only)
// @route   GET /api/v1/deliveries/:id/payout-report
// @access  Private (COOP_ADMIN)
const getPayoutReport = async (req, res) => {
    const deliveryId = req.params.id;
    const sellerOrgId = req.user.organization_id;
    try {
        // Check delivery ownership
        const delivery = await db('deliveries').where({ id: deliveryId }).first();
        if (!delivery || delivery.seller_id !== sellerOrgId) {
            return res.status(403).json({ message: 'You are not authorized to view this payout report.' });
        }
        // Get linked collections
        const links = await db('collection_delivery_link').where({ delivery_id: deliveryId }).select('collection_id');
        const collectionIds = links.map(l => l.collection_id);
        if (collectionIds.length === 0) {
            return res.status(404).json({ message: 'No collections linked to this delivery.' });
        }
        // Get collections and calculate payouts
        const collections = await db('produce_collections').whereIn('id', collectionIds).select('id', 'farmer_id', 'quantity', 'unit_price');
        const payouts = [];
        for (const col of collections) {
            const farmer = await db('farmers').where({ id: col.farmer_id }).first();
            payouts.push({
                farmer_id: col.farmer_id,
                farmer_name: farmer ? `${farmer.first_name} ${farmer.last_name}` : 'Unknown',
                quantity: col.quantity,
                unit_price: col.unit_price,
                amount: parseFloat(col.quantity) * parseFloat(col.unit_price)
            });
        }
        res.status(200).json({ delivery_id: deliveryId, payouts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error generating payout report.' });
    }
};

module.exports = {
    verifyDelivery,
    updateDeliveryStatus,
    adminUpdateDelivery,
    getSellerDeliveries,
    getBuyerDeliveries,
    getAllDeliveries,
    assignCollectionsToDelivery,
    getPayoutReport
};
