// src/routes/collectionRoutes.js
const express = require('express');
const router = express.Router();
const {
    recordCollection,
    getCollections,
    getCollectionById,
    deactivateCollection,
} = require('../controllers/collectionController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.get('/:id', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN']), getCollectionById);
router.patch('/:id/deactivate', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN']), deactivateCollection);

module.exports = router;
