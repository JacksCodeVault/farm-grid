// src/controllers/webhookController.js
const db = require('../db/database');
const { sendSms } = require('../services/smsService');

// Helper function to parse incoming SMS commands
const parseSmsCommand = (message) => {
    const parts = message.toUpperCase().split(' ');
    const command = parts[0];
    const data = {};

    for (let i = 1; i < parts.length; i += 2) {
        const key = parts[i].toLowerCase();
        const value = parts[i + 1];
        data[key] = value;
    }
    return { command, data };
};

// @desc    Process incoming SMS webhooks
// @route   POST /webhooks/sms/incoming
// @access  Public (called by SMS provider)
const processIncomingSms = async (req, res) => {
    // Example payload from Africa's Talking:
    // {
    //     "from": "+254712345678",
    //     "to": "20880", // Your shortcode or long number
    //     "text": "COLLECT farmer_id 123 weight 50.5 commodity_id 1",
    //     "date": "2023-10-27 10:00:00",
    //     "id": "ATXid_..."
    // }
    const { from, text } = req.body; // Adjust based on actual SMS provider payload

    if (!from || !text) {
        return res.status(400).json({ message: 'Invalid SMS webhook payload' });
    }

    const { command, data } = parseSmsCommand(text);
    console.log(`Received SMS from ${from}. Command: ${command}, Data:`, data);

    try {
        switch (command) {
            case 'COLLECT':
                // Example: COLLECT farmer_id 123 quantity 50.5 commodity_id 1
                const { farmer_id, quantity, commodity_id } = data;

                if (!farmer_id || !quantity || !commodity_id) {
                    await sendSms(from, 'Error: Missing parameters for COLLECT command. Usage: COLLECT farmer_id [id] quantity [qty] commodity_id [id]');
                    return res.status(400).json({ message: 'Missing parameters for COLLECT command' });
                }

                // Find the field operator who sent the SMS (assuming 'from' is their phone_number)
                const fieldOperator = await db('users').where({ phone_number: from }).first();
                if (!fieldOperator) {
                    await sendSms(from, 'Error: Your phone number is not registered as a Field Operator.');
                    return res.status(403).json({ message: 'Sender not a registered Field Operator' });
                }

                // Find the farmer
                const farmer = await db('farmers').where({ id: farmer_id }).first();
                if (!farmer) {
                    await sendSms(from, `Error: Farmer with ID ${farmer_id} not found.`);
                    return res.status(404).json({ message: `Farmer with ID ${farmer_id} not found` });
                }

                // Record the produce collection
                await db('produce_collections').insert({
                    farmer_id: farmer.id,
                    field_operator_id: fieldOperator.id,
                    cooperative_id: farmer.cooperative_id, // Assuming farmer's cooperative
                    commodity_id: commodity_id,
                    quantity: parseFloat(quantity),
                    status: 'IN_STOCK',
                });

                await sendSms(from, `Collection recorded for Farmer ${farmer.first_name} ${farmer.last_name}: ${quantity} units of Commodity ${commodity_id}.`);
                break;

            case 'REGISTER_FARMER':
                // Example: REGISTER_FARMER first_name John last_name Doe phone_number +2547... cooperative_id 1 village_id 1
                const { first_name, last_name, phone_number, cooperative_id, village_id } = data;

                if (!first_name || !last_name || !phone_number || !cooperative_id || !village_id) {
                    await sendSms(from, 'Error: Missing parameters for REGISTER_FARMER command. Usage: REGISTER_FARMER first_name [fname] last_name [lname] phone_number [phone] cooperative_id [coop_id] village_id [village_id]');
                    return res.status(400).json({ message: 'Missing parameters for REGISTER_FARMER command' });
                }

                const registeringUser = await db('users').where({ phone_number: from }).first();
                if (!registeringUser || !['COOP_ADMIN', 'SYSTEM_ADMIN', 'FIELD_OPERATOR'].includes(registeringUser.role)) {
                    await sendSms(from, 'Error: You are not authorized to register farmers.');
                    return res.status(403).json({ message: 'Sender not authorized to register farmers' });
                }

                const existingFarmer = await db('farmers').where({ phone_number }).first();
                if (existingFarmer) {
                    await sendSms(from, `Error: Farmer with phone number ${phone_number} already exists.`);
                    return res.status(400).json({ message: 'Farmer with this phone number already exists' });
                }

                await db('farmers').insert({
                    first_name,
                    last_name,
                    phone_number,
                    cooperative_id,
                    village_id,
                    registered_by_user_id: registeringUser.id,
                });
                await sendSms(from, `Farmer ${first_name} ${last_name} registered successfully.`);
                break;

            // Add more cases for other commands (e.g., ORDER, DELIVER, PAY)
            default:
                await sendSms(from, `Unknown command: ${command}. Available commands: COLLECT, REGISTER_FARMER.`);
                return res.status(400).json({ message: `Unknown command: ${command}` });
        }
        res.status(200).json({ message: 'SMS processed successfully' });
    } catch (error) {
        console.error('Error processing SMS webhook:', error);
        await sendSms(from, 'An internal server error occurred while processing your request.');
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    processIncomingSms,
};
