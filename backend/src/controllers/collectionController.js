// src/controllers/collectionController.js
const db = require('../db/database');

// @desc    Record a new produce collection
// @route   POST /api/collections
// @access  Private (Field Operator, Coop Admin, System Admin)
const recordCollection = async (req, res) => {
    const { farmer_id, commodity_id, quantity } = req.body;
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
        const collections = await db('produce_collections').select('*');
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

module.exports = {
    recordCollection,
    getCollections,
    getCollectionById,
    deactivateCollection,
};
