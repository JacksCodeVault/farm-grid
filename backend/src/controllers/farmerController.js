// @desc    Delete a farmer
// @route   DELETE /api/farmers/:id
// @access  Private (Coop Admin, System Admin)
const deleteFarmer = async (req, res) => {
    try {
        const deletedRows = await db('farmers').where({ id: req.params.id }).del();
        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Farmer not found' });
        }
        res.status(200).json({ message: 'Farmer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting farmer' });
    }
};
// src/controllers/farmerController.js
const db = require('../db/database');

// @desc    Register a new farmer
// @route   POST /api/farmers
// @access  Private (Field Operator only)
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
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(409).json({ message: 'Cannot register farmer: the specified village does not exist. Please provide a valid village_id.' });
        } else {
            res.status(500).json({ message: 'Server error during farmer registration' });
        }
    }
};

// @desc    Get all farmers
// @route   GET /api/farmers
// @access  Private (Coop Admin, System Admin)
const getFarmers = async (req, res) => {
    try {
        console.log('getFarmers called by user:', req.user);
        let query = db('farmers')
            .leftJoin('organizations as cooperatives', function() {
                this.on('farmers.cooperative_id', '=', 'cooperatives.id')
                    .andOn('cooperatives.org_type', '=', db.raw('?', ['COOPERATIVE']));
            })
            .leftJoin('villages', 'farmers.village_id', 'villages.id')
            .leftJoin('users as registered_by', 'farmers.registered_by_user_id', 'registered_by.id')
            .select(
                'farmers.id',
                'farmers.first_name',
                'farmers.last_name',
                'farmers.phone_number',
                'cooperatives.name as cooperative_name',
                'villages.name as village_name',
                db.raw("CONCAT(COALESCE(registered_by.name, ''), ' (', COALESCE(registered_by.email, ''), ')') as registered_by_name"),
                'farmers.registered_by_user_id',
                'farmers.created_at',
                'farmers.updated_at',
                'farmers.is_active'
            );
        if (req.user.role === 'COOP_ADMIN') {
            console.log('Filtering farmers by cooperative_id:', req.user.organization_id);
            query = query.where('farmers.cooperative_id', req.user.organization_id);
        }
        const farmers = await query;
        // Format dates
        const formattedFarmers = farmers.map(farmer => ({
            ...farmer,
            created_at: farmer.created_at ? new Date(farmer.created_at).toLocaleString() : '',
            updated_at: farmer.updated_at ? new Date(farmer.updated_at).toLocaleString() : ''
        }));
        console.log('Farmers result:', formattedFarmers);
        res.status(200).json(formattedFarmers);
    } catch (error) {
        console.error('Error in getFarmers:', error);
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

// @desc    Activate a farmer
// @route   PATCH /api/farmers/:id/activate
// @access  Private (Coop Admin, System Admin, Board Member)
const activateFarmer = async (req, res) => {
    try {
        const updatedRows = await db('farmers')
            .where({ id: req.params.id })
            .update({ is_active: true });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        res.status(200).json({ message: 'Farmer activated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error activating farmer' });
    }
};

// @desc    Update farmer details
// @route   PATCH /api/farmers/:id
// @access  Private (All roles)
const updateFarmer = async (req, res) => {
    try {
        // Only update fields that are present in the request body
        const updateData = {};
        const allowedFields = ['first_name', 'last_name', 'phone_number', 'cooperative_id', 'village_id', 'is_active'];
        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                updateData[field] = req.body[field];
            }
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided to update.' });
        }
        const updatedRows = await db('farmers')
            .where({ id: req.params.id })
            .update(updateData);
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Farmer not found' });
        }
        const updatedFarmer = await db('farmers').where({ id: req.params.id }).first();
        res.status(200).json({ message: 'Farmer updated successfully', farmer: updatedFarmer });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(409).json({ message: 'Cannot update farmer: the specified village does not exist. Please provide a valid village_id.' });
        } else {
            res.status(500).json({ message: 'Server error updating farmer' });
        }
    }
};

module.exports = {
    registerFarmer,
    getFarmers,
    getFarmerById,
    deactivateFarmer,
    updateFarmer,
    deleteFarmer,
    activateFarmer,
};
