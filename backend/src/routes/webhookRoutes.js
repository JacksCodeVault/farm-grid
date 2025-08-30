// src/routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { processIncomingSms } = require('../controllers/webhookController');

router.post('/sms/incoming', processIncomingSms);

module.exports = router;
