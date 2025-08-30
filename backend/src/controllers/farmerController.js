// src/controllers/farmerController.js
const db = require('../db/database');

// @desc    Register a new farmer
// @route   POST /api/farmers
// @access  Private (Coop Admin, System Admin)
const registerFarmer = async (req, res) => {
    const { first_name, last_name, phone_number, cooperative_id, village_id } = req.body;
    const registered_by_user_id = req.user.id; // Assuming user ID is available from auth middleware

    if (!first_name || !last_name || !phone_number || !cooperative_id || !village_id) {
        return res.status(400).json({ message: 'Please enter all required farmer fields' });
    }

    // Check if farmer with this phone number already exists
    const farmerExists = await db('farmers').where({ phone_number }).first();
    if (farmerExists) {
        return res.status(400).json({ message: 'Farmer with this phone number already exists' });
    }

    try {
        const [farmerId] = await db('farmers').insert({
            first_name,
            last_name,
            phone_number,
            cooperative_id,
            village_id,
            registered_by_user_id,
        });

        res.status(201).json({
            message: 'Farmer registered successfully',
            farmer: {
                id: farmerId,
                first_name,
                last_name,
                phone_number,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during farmer registration' });
    }
};

// @desc    Get all farmers
// @route   GET /api/farmers
// @access  Private (Coop Admin, System Admin)
const getFarmers = async (req, res) => {
    try {
        const farmers = await db('farmers').select('*');
        res.status(200).json(farmers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching farmers' });
    }
};

// @desc    Get single farmer by ID
// @route   GET /api/farmers/:id
// @access  Private (Coop Admin, System Admin, Field Operator if assigned)
const getFarmerById = async (req, res) => {
    try {
        const farmer = await db('farmers').where({ id: req.params.id }).first();
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }
        res.status(200).json(farmer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching farmer' });
    }
};


// @desc    Deactivate a farmer
// @route   PATCH /api/farmers/:id/deactivate
// @access  Private (Coop Admin, System Admin, Board Member)
const deactivateFarmer = async (req, res) => {
    try {
        const updatedRows = await db('farmers')
            .where({ id: req.params.id })
            .update({ is_active: false });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        res.status(200).json({ message: 'Farmer deactivated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deactivating farmer' });
    }
};

module.exports = {
    registerFarmer,
    getFarmers,
    getFarmerById,
    deactivateFarmer,
};
