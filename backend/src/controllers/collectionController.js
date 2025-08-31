// src/controllers/collectionController.js
const db = require('../db/database');
const smsService = require('../services/smsService');

// @desc    Record a new produce collection
// @route   POST /api/collections
// @access  Private (Field Operator, Coop Admin, System Admin)
const recordCollection = async (req, res) => {
    const { farmer_id, commodity_id, quantity, unit_price } = req.body;
    const field_operator_id = req.user.id; // Assuming user ID is available from auth middleware

    if (!farmer_id || !commodity_id || !quantity) {
        return res.status(400).json({ message: 'Please provide farmer_id, commodity_id, and quantity' });
    }

    try {
        // Fetch farmer to get cooperative_id
        const farmer = await db('farmers').where({ id: farmer_id }).first();
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        const [collectionId] = await db('produce_collections').insert({
            farmer_id,
            field_operator_id,
            cooperative_id: farmer.cooperative_id,
            commodity_id,
            quantity: parseFloat(quantity),
            unit_price: unit_price !== undefined ? parseFloat(unit_price) : 0,
            status: 'IN_STOCK',
        });

        res.status(201).json({
            message: 'Produce collection recorded successfully',
            collection: {
                id: collectionId,
                farmer_id,
                commodity_id,
                quantity,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error recording collection' });
    }
};

// @desc    Get all produce collections
// @route   GET /api/collections
// @access  Private (Coop Admin, System Admin)
const getCollections = async (req, res) => {
    try {
        const collections = await db('produce_collections')
            .leftJoin('farmers', 'produce_collections.farmer_id', 'farmers.id')
            .leftJoin('commodities', 'produce_collections.commodity_id', 'commodities.id')
            .select(
                'produce_collections.*',
                db.raw("CONCAT(farmers.first_name, ' ', farmers.last_name) as farmerName"),
                'commodities.name as commodityName'
            );
        res.status(200).json(collections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching collections' });
    }
};

// @desc    Get single produce collection by ID
// @route   GET /api/collections/:id
// @access  Private (Coop Admin, System Admin, Field Operator if involved)
const getCollectionById = async (req, res) => {
    try {
        const collection = await db('produce_collections').where({ id: req.params.id }).first();
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.status(200).json(collection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching collection' });
    }
};


// @desc    Deactivate a produce collection
// @route   PATCH /api/collections/:id/deactivate
// @access  Private (Coop Admin, System Admin)
const deactivateCollection = async (req, res) => {
    try {
        const updatedRows = await db('produce_collections')
            .where({ id: req.params.id })
            .update({ is_active: false });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        res.status(200).json({ message: 'Collection deactivated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deactivating collection' });
    }
};

// @desc    Update produce collection details
// @route   PATCH /api/collections/:id
// @access  Private (Field Operator)
const updateCollection = async (req, res) => {
    const { commodity_id, quantity, status } = req.body;
    console.log(`[updateCollection] Updating collection ID: ${req.params.id}, Body:`, req.body);
    try {
        // Build update object only with defined fields
        const updateObj = {};
        if (commodity_id !== undefined) updateObj.commodity_id = commodity_id;
        if (quantity !== undefined) updateObj.quantity = parseFloat(quantity);
        if (status !== undefined) {
            const allowedStatuses = ['IN_STOCK', 'ALLOCATED_TO_DELIVERY'];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ message: `Invalid status for produce collection: ${status}. Allowed statuses are: ${allowedStatuses.join(', ')}` });
            }
            updateObj.status = status;
        }

        if (Object.keys(updateObj).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update.' });
        }

        const updatedRows = await db('produce_collections')
            .where({ id: req.params.id })
            .update(updateObj);
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        const updatedCollection = await db('produce_collections').where({ id: req.params.id }).first();
        res.status(200).json({ message: 'Collection updated successfully', collection: updatedCollection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating collection' });
    }
};

// @desc    Mark a collection as paid
// @route   PATCH /api/collections/:id/mark-paid
// @access  Private (Coop Admin)
const markCollectionPaid = async (req, res) => {
    const collectionId = req.params.id;
    console.log('Marking collection as paid. Collection ID:', collectionId);
    try {
        // Mark collection as paid
        await db('produce_collections').where({ id: collectionId }).update({ is_paid: true });
        // Get farmer info
        const collection = await db('produce_collections').where({ id: collectionId }).first();
        console.log('Collection record:', collection);
        const farmer = collection ? await db('farmers').where({ id: collection.farmer_id }).first() : null;
        console.log('Farmer record:', farmer);
        // Send SMS notification
        if (farmer && farmer.phone_number) {
            await smsService.sendSms(farmer.phone_number, `Dear ${farmer.first_name}, your payout for collection #${collectionId} has been processed. Thank you for your hard work! - FarmGrid`);
        }
        res.status(200).json({ message: 'Collection marked as paid and farmer notified.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error marking collection as paid.' });
    }
};

// @desc    Activate a produce collection
// @route   PATCH /api/collections/:id/activate
// @access  Private (Coop Admin, System Admin)
const activateCollection = async (req, res) => {
    try {
        const updatedRows = await db('produce_collections')
            .where({ id: req.params.id })
            .update({ is_active: true });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        res.status(200).json({ message: 'Collection activated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error activating collection' });
    }
};

module.exports = {
    recordCollection,
    getCollections,
    getCollectionById,
    deactivateCollection,
    updateCollection,
    markCollectionPaid,
    activateCollection
};
