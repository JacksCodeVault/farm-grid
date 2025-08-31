// src/routes/farmRoutes.js
const express = require('express');
const router = express.Router();
const { createFarm, getFarms, getFarmById, updateFarm, deleteFarm } = require('../controllers/farmController');
const { protect, authorize } = require('../middleware/authMiddleware');

// COOP_ADMIN CRUD on farms
router.post('/', protect, authorize(['COOP_ADMIN']), createFarm);
router.get('/', protect, authorize(['COOP_ADMIN']), getFarms);
router.get('/:id', protect, authorize(['COOP_ADMIN']), getFarmById);
router.patch('/:id', protect, authorize(['COOP_ADMIN']), updateFarm);
router.delete('/:id', protect, authorize(['COOP_ADMIN']), deleteFarm);

module.exports = router;
