// src/routes/collectionRoutes.js
const express = require('express');
const router = express.Router();
const {
    recordCollection,
    getCollections,
    getCollectionById,
    updateCollection,
    deleteCollection,
} = require('../controllers/collectionController');
const { protect } = require('../middleware/authMiddleware');

// All collection routes are protected
router.use(protect);

router.route('/')
    .post(recordCollection)
    .get(getCollections);

router.route('/:id')
    .get(getCollectionById)
    .put(updateCollection)
    .delete(deleteCollection);

module.exports = router;
