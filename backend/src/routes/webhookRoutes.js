// src/routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { processIncomingSms } = require('../controllers/webhookController');

// This route is public as it's called by external SMS providers
router.post('/sms/incoming', processIncomingSms);

module.exports = router;
