// src/routes/collectionRoutes.js
const express = require('express');
const router = express.Router();
const {
    recordCollection,
    getCollections,
    getCollectionById,
    deactivateCollection,
    updateCollection,
    markCollectionPaid,
    activateCollection,
} = require('../controllers/collectionController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.get('/', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN', 'FIELD_OPERATOR']), getCollections);
router.get('/:id', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN']), getCollectionById);
router.patch('/:id/deactivate', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN']), deactivateCollection);
router.patch('/:id/activate', protect, authorize(['COOP_ADMIN', 'SYSTEM_ADMIN']), activateCollection);
router.post('/', protect, authorize(['FIELD_OPERATOR']), recordCollection);
router.patch('/:id', protect, authorize(['FIELD_OPERATOR', 'COOP_ADMIN']), updateCollection);
router.patch('/:id/mark-paid', protect, authorize(['COOP_ADMIN']), markCollectionPaid);

module.exports = router;
