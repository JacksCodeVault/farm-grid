const express = require('express');
const router = express.Router();
const { createFieldOperator } = require('../controllers/coopAdminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// COOP_ADMIN can create FIELD_OPERATORs
router.post('/field-operators', protect, authorize(['COOP_ADMIN']), createFieldOperator);

module.exports = router;
