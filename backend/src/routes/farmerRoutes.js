// src/routes/farmerRoutes.js
const express = require('express');
const router = express.Router();
const {
    registerFarmer,
    getFarmers,
    getFarmerById,
    updateFarmer,
    deleteFarmer,
} = require('../controllers/farmerController');
const { protect } = require('../middleware/authMiddleware');

// All farmer routes are protected
router.use(protect);

router.route('/')
    .post(registerFarmer)
    .get(getFarmers);

router.route('/:id')
    .get(getFarmerById)
    .put(updateFarmer)
    .delete(deleteFarmer);

module.exports = router;
