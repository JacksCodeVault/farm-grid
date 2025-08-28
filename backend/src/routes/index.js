// src/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const farmerRoutes = require('./farmerRoutes');
const webhookRoutes = require('./webhookRoutes');
const collectionRoutes = require('./collectionRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/farmers', farmerRoutes);
router.use('/collections', collectionRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/webhooks', webhookRoutes); // For incoming SMS webhooks

module.exports = router;
