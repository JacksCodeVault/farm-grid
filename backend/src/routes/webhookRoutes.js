// src/routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { processIncomingSms, testWebhook } = require('../controllers/webhookController');

// Main webhook endpoint for SMS provider
router.post('/sms/incoming', processIncomingSms);

// Test endpoint for development
router.post('/sms/test', testWebhook);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Webhook service is healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;