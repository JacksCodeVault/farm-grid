const express = require('express');
const router = express.Router();
const { createCommodity, getCommodities, getCommodityById, updateCommodity, deleteCommodity } = require('../controllers/commodityController');
const { protect, authorize } = require('../middleware/authMiddleware');

// SYSTEM_ADMIN can create commodities
router.post('/', protect, authorize(['SYSTEM_ADMIN']), createCommodity);
router.get('/', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER']), getCommodities);
router.get('/:id', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER']), getCommodityById);
router.patch('/:id', protect, authorize(['SYSTEM_ADMIN']), updateCommodity);
router.delete('/:id', protect, authorize(['SYSTEM_ADMIN']), deleteCommodity);

module.exports = router;
