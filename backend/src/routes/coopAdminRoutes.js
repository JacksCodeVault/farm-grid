
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const deliveryController = require('../controllers/deliveryController');
// Update delivery status (COOP_ADMIN)
router.patch('/deliveries/:id/status', protect, authorize(['COOP_ADMIN']), deliveryController.updateDeliveryStatus);

// List deliveries for COOP_ADMIN
router.get('/deliveries', protect, authorize(['COOP_ADMIN']), deliveryController.getSellerDeliveries);

// Create a delivery for COOP_ADMIN
router.post('/deliveries', protect, authorize(['COOP_ADMIN']), async (req, res) => {
	const sellerOrgId = req.user.organization_id;
	const { order_id, delivery_date } = req.body;
	if (!order_id) {
		return res.status(400).json({ message: 'order_id is required' });
	}
	try {
		const [id] = await require('../db/database')('deliveries').insert({
			order_id,
			seller_id: sellerOrgId,
			delivery_date,
			status: 'PENDING',
		});
		const delivery = await require('../db/database')('deliveries').where({ id }).first();
		res.status(201).json(delivery);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error creating delivery' });
	}
});

// Dispatch a delivery (set status to IN_TRANSIT)
router.patch('/deliveries/:id/dispatch', protect, authorize(['COOP_ADMIN']), async (req, res) => {
		const deliveryId = req.params.id;
		const sellerOrgId = req.user.organization_id;
		try {
			const delivery = await require('../db/database')('deliveries').where({ id: deliveryId }).first();
			if (!delivery) {
				return res.status(404).json({ message: 'Delivery not found' });
			}
			if (delivery.seller_id !== sellerOrgId) {
				return res.status(403).json({ message: 'You are not authorized to dispatch this delivery.' });
			}
				await require('../db/database')('deliveries').where({ id: deliveryId }).update({ status: 'IN_TRANSIT', updated_at: require('../db/database').fn.now() });
				const updatedDelivery = await require('../db/database')('deliveries').where({ id: deliveryId }).first();
				console.log('[DISPATCH] Dispatch called by user:', {
					id: req.user.id,
					name: req.user.name,
					email: req.user.email,
					role: req.user.role,
					organization_id: req.user.organization_id
				});
				console.log(`[DISPATCH] Delivery change:`, {
					delivery_id: deliveryId,
					previous_status: delivery.status,
					new_status: updatedDelivery.status,
					updated_at: updatedDelivery.updated_at
				});
				res.status(200).json({ message: 'Delivery dispatched.', delivery: updatedDelivery });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server error dispatching delivery' });
		}
	});


const { createFieldOperator } = require('../controllers/coopAdminController');
// COOP_ADMIN can create FIELD_OPERATORs
router.post('/field-operators', protect, authorize(['COOP_ADMIN']), createFieldOperator);

module.exports = router;
