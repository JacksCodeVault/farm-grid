// src/controllers/webhookController.js
const db = require('../db/database');
const { 
    sendSms, 
    formatPhoneNumber, 
    isValidKenyanPhone 
} = require('../services/smsService');

// Helper function to parse incoming SMS commands
const parseSmsCommand = (message) => {
    const trimmedMessage = message.trim();
    const parts = trimmedMessage.split(/\s+/); // Split by any whitespace
    const command = parts[0].toUpperCase();
    const data = {};

    // Parse key-value pairs
    for (let i = 1; i < parts.length; i += 2) {
        if (i + 1 < parts.length) {
            const key = parts[i].toLowerCase().replace(':', ''); // Remove colons if present
            const value = parts[i + 1];
            data[key] = value;
        }
    }
    
    return { command, data, originalMessage: trimmedMessage };
};

// Helper function to validate required fields
const validateRequiredFields = (data, requiredFields) => {
    const missing = [];
    requiredFields.forEach(field => {
        if (!data[field]) {
            missing.push(field);
        }
    });
    return missing;
};

// Helper function to get user by phone number
const getUserByPhone = async (phoneNumber) => {
    try {
        const formattedPhone = formatPhoneNumber(phoneNumber);
        return await db('users')
            .where({ phone_number: formattedPhone })
            .orWhere({ phone_number: phoneNumber })
            .first();
    } catch (error) {
        console.error('Error formatting phone number:', error);
        return null;
    }
};

// Helper function to send error response
const sendErrorResponse = async (phoneNumber, errorMessage) => {
    try {
        await sendSms(phoneNumber, `❌ Error: ${errorMessage}`);
    } catch (error) {
        console.error('Failed to send error SMS:', error);
    }
};

// Helper function to send success response
const sendSuccessResponse = async (phoneNumber, successMessage) => {
    try {
        await sendSms(phoneNumber, `✅ ${successMessage}`);
    } catch (error) {
        console.error('Failed to send success SMS:', error);
    }
};

// Command handlers
const commandHandlers = {
    COLLECT: async (from, data, originalMessage) => {
        const requiredFields = ['farmer_id', 'quantity', 'commodity_id'];
        const missingFields = validateRequiredFields(data, requiredFields);
        
        if (missingFields.length > 0) {
            const usage = 'Usage: COLLECT farmer_id [ID] quantity [QTY] commodity_id [COMM_ID]';
            await sendErrorResponse(from, `Missing: ${missingFields.join(', ')}. ${usage}`);
            return { success: false, message: 'Missing required fields' };
        }

        // Validate field operator
        const fieldOperator = await getUserByPhone(from);
        if (!fieldOperator || fieldOperator.role !== 'FIELD_OPERATOR') {
            await sendErrorResponse(from, 'You are not registered as a Field Operator.');
            return { success: false, message: 'Unauthorized user' };
        }

        // Validate farmer exists
        const farmer = await db('farmers').where({ id: data.farmer_id }).first();
        if (!farmer) {
            await sendErrorResponse(from, `Farmer with ID ${data.farmer_id} not found.`);
            return { success: false, message: 'Farmer not found' };
        }

        // Validate commodity exists
        const commodity = await db('commodities').where({ id: data.commodity_id }).first();
        if (!commodity) {
            await sendErrorResponse(from, `Commodity with ID ${data.commodity_id} not found.`);
            return { success: false, message: 'Commodity not found' };
        }

        // Validate quantity
        const quantity = parseFloat(data.quantity);
        if (isNaN(quantity) || quantity <= 0) {
            await sendErrorResponse(from, 'Quantity must be a positive number.');
            return { success: false, message: 'Invalid quantity' };
        }

        try {
            // Record the produce collection
            const [collectionId] = await db('produce_collections').insert({
                farmer_id: farmer.id,
                field_operator_id: fieldOperator.id,
                cooperative_id: farmer.cooperative_id,
                commodity_id: commodity.id,
                quantity: quantity,
                status: 'IN_STOCK',
                collected_at: new Date(),
                notes: `SMS Collection: ${originalMessage}`
            });

            const successMsg = `Collection #${collectionId} recorded successfully!\n` +
                             `Farmer: ${farmer.first_name} ${farmer.last_name}\n` +
                             `Commodity: ${commodity.name}\n` +
                             `Quantity: ${quantity} ${commodity.unit || 'units'}`;
            
            await sendSuccessResponse(from, successMsg);
            
            // Notify farmer
            if (farmer.phone_number) {
                const farmerMsg = `Your produce has been collected!\n` +
                               `Quantity: ${quantity} ${commodity.unit || 'units'} of ${commodity.name}\n` +
                               `Collection ID: ${collectionId}`;
                await sendSms(farmer.phone_number, farmerMsg);
            }

            return { success: true, data: { collectionId, farmer, commodity, quantity } };
        } catch (dbError) {
            console.error('Database error during collection:', dbError);
            await sendErrorResponse(from, 'Failed to record collection. Please try again.');
            return { success: false, message: 'Database error' };
        }
    },

    REGISTER_FARMER: async (from, data, originalMessage) => {
        const requiredFields = ['first_name', 'last_name', 'phone_number', 'cooperative_id'];
        const missingFields = validateRequiredFields(data, requiredFields);
        
        if (missingFields.length > 0) {
            const usage = 'Usage: REGISTER_FARMER first_name [NAME] last_name [SURNAME] phone_number [PHONE] cooperative_id [COOP_ID]';
            await sendErrorResponse(from, `Missing: ${missingFields.join(', ')}. ${usage}`);
            return { success: false, message: 'Missing required fields' };
        }

        // Validate registering user
        const registeringUser = await getUserByPhone(from);
        if (!registeringUser || !['COOP_ADMIN', 'SYSTEM_ADMIN', 'FIELD_OPERATOR'].includes(registeringUser.role)) {
            await sendErrorResponse(from, 'You are not authorized to register farmers.');
            return { success: false, message: 'Unauthorized user' };
        }

        // Validate phone number format
        if (!isValidKenyanPhone(data.phone_number)) {
            await sendErrorResponse(from, 'Invalid phone number format. Use: +254XXXXXXXXX or 07XXXXXXXX');
            return { success: false, message: 'Invalid phone number' };
        }

        const formattedPhone = formatPhoneNumber(data.phone_number);

        // Check if farmer already exists
        const existingFarmer = await db('farmers')
            .where({ phone_number: formattedPhone })
            .orWhere({ phone_number: data.phone_number })
            .first();
        
        if (existingFarmer) {
            await sendErrorResponse(from, `Farmer with phone ${data.phone_number} already registered.`);
            return { success: false, message: 'Farmer already exists' };
        }

        // Validate cooperative exists
        const cooperative = await db('cooperatives').where({ id: data.cooperative_id }).first();
        if (!cooperative) {
            await sendErrorResponse(from, `Cooperative with ID ${data.cooperative_id} not found.`);
            return { success: false, message: 'Cooperative not found' };
        }

        try {
            const [farmerId] = await db('farmers').insert({
                first_name: data.first_name,
                last_name: data.last_name,
                phone_number: formattedPhone,
                cooperative_id: data.cooperative_id,
                village_id: data.village_id || null,
                registered_by_user_id: registeringUser.id,
                registration_method: 'SMS',
                created_at: new Date(),
                updated_at: new Date()
            });

            const successMsg = `Farmer registered successfully!\n` +
                             `ID: ${farmerId}\n` +
                             `Name: ${data.first_name} ${data.last_name}\n` +
                             `Phone: ${formattedPhone}\n` +
                             `Cooperative: ${cooperative.name}`;
            
            await sendSuccessResponse(from, successMsg);

            // Send welcome SMS to new farmer
            const welcomeMsg = `Welcome to FarmGrid, ${data.first_name}!\n` +
                             `You've been registered with ${cooperative.name}.\n` +
                             `Your Farmer ID is: ${farmerId}`;
            await sendSms(formattedPhone, welcomeMsg);

            return { success: true, data: { farmerId, farmer: { ...data, id: farmerId } } };
        } catch (dbError) {
            console.error('Database error during farmer registration:', dbError);
            await sendErrorResponse(from, 'Failed to register farmer. Please try again.');
            return { success: false, message: 'Database error' };
        }
    },

    STATUS: async (from, data, originalMessage) => {
        const user = await getUserByPhone(from);
        if (!user) {
            await sendErrorResponse(from, 'Your phone number is not registered in the system.');
            return { success: false, message: 'User not found' };
        }

        let statusMsg = `📊 Your FarmGrid Status:\n` +
                       `Name: ${user.first_name} ${user.last_name}\n` +
                       `Role: ${user.role}\n` +
                       `Phone: ${user.phone_number}`;

        if (data.collection_id) {
            // Get specific collection status
            const collection = await db('produce_collections')
                .join('farmers', 'produce_collections.farmer_id', 'farmers.id')
                .join('commodities', 'produce_collections.commodity_id', 'commodities.id')
                .where('produce_collections.id', data.collection_id)
                .select(
                    'produce_collections.*',
                    'farmers.first_name as farmer_first_name',
                    'farmers.last_name as farmer_last_name',
                    'commodities.name as commodity_name'
                )
                .first();

            if (collection) {
                statusMsg += `\n\n📦 Collection #${collection.id}:\n` +
                           `Farmer: ${collection.farmer_first_name} ${collection.farmer_last_name}\n` +
                           `Commodity: ${collection.commodity_name}\n` +
                           `Quantity: ${collection.quantity}\n` +
                           `Status: ${collection.status}\n` +
                           `Date: ${new Date(collection.collected_at).toLocaleDateString()}`;
            } else {
                statusMsg += `\n\n❌ Collection #${data.collection_id} not found.`;
            }
        }

        await sendSms(from, statusMsg);
        return { success: true, data: { user } };
    },

    HELP: async (from, data, originalMessage) => {
        const helpMsg = `📚 FarmGrid SMS Commands:\n\n` +
                       `🔹 COLLECT farmer_id [ID] quantity [QTY] commodity_id [COMM_ID]\n` +
                       `   Record produce collection\n\n` +
                       `🔹 REGISTER_FARMER first_name [NAME] last_name [SURNAME] phone_number [PHONE] cooperative_id [COOP_ID]\n` +
                       `   Register new farmer\n\n` +
                       `🔹 STATUS [collection_id [ID]]\n` +
                       `   Check your status or collection status\n\n` +
                       `🔹 HELP\n` +
                       `   Show this help message\n\n` +
                       `Example:\nCOLLECT farmer_id 123 quantity 50.5 commodity_id 1`;

        await sendSms(from, helpMsg);
        return { success: true, data: { helpSent: true } };
    }
};

// @desc    Process incoming SMS webhooks
// @route   POST /webhooks/sms/incoming
// @access  Public (called by SMS provider)
const processIncomingSms = async (req, res) => {
    try {
        // Log the incoming request for debugging
        console.log('📨 Incoming SMS webhook:', JSON.stringify(req.body, null, 2));

        // Adjust these field names based on your SMS provider's webhook format
        // Common formats:
        // Eneza SMS: { from: "+254...", text: "...", to: "...", date: "..." }
        // Africa's Talking: { from: "+254...", text: "...", to: "...", date: "...", id: "..." }
        // Twilio: { From: "+254...", Body: "...", To: "...", MessageSid: "..." }
        
        const { 
            from, 
            text, 
            // Add other fields as needed
            to,
            date,
            id,
            messageId 
        } = req.body;

        // Validate required fields
        if (!from || !text) {
            console.error('❌ Invalid SMS webhook payload - missing from or text');
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid SMS webhook payload - missing from or text' 
            });
        }

        const { command, data, originalMessage } = parseSmsCommand(text);
        
        console.log(`📱 Processing SMS from ${from}`);
        console.log(`💬 Command: ${command}`);
        console.log(`📋 Data:`, data);
        console.log(`📄 Original message: "${originalMessage}"`);

        // Check if we have a handler for this command
        const handler = commandHandlers[command];
        if (!handler) {
            const availableCommands = Object.keys(commandHandlers).join(', ');
            await sendErrorResponse(from, `Unknown command: ${command}. Available commands: ${availableCommands}. Send HELP for usage.`);
            return res.status(400).json({ 
                success: false, 
                message: `Unknown command: ${command}` 
            });
        }

        // Execute the command handler
        const result = await handler(from, data, originalMessage);

        // Log the result
        console.log(`✅ Command ${command} processed:`, result.success ? 'SUCCESS' : 'FAILED');
        if (!result.success) {
            console.log(`❌ Error: ${result.message}`);
        }

        // Store SMS log for auditing (optional)
        try {
            await db('sms_logs').insert({
                phone_number: from,
                message: originalMessage,
                command: command,
                status: result.success ? 'SUCCESS' : 'FAILED',
                response: result.message || null,
                webhook_data: JSON.stringify(req.body),
                processed_at: new Date()
            });
        } catch (logError) {
            console.error('Failed to log SMS:', logError);
            // Don't fail the request if logging fails
        }

        return res.status(200).json({ 
            success: true, 
            message: 'SMS processed successfully',
            command: command,
            result: result.success
        });

    } catch (error) {
        console.error('❌ Error processing SMS webhook:', error);
        
        // Try to send error SMS if we have the phone number
        if (req.body.from) {
            try {
                await sendErrorResponse(req.body.from, 'An internal server error occurred. Please try again later.');
            } catch (smsError) {
                console.error('Failed to send error SMS:', smsError);
            }
        }

        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// @desc    Test webhook endpoint (for development)
// @route   POST /webhooks/sms/test
// @access  Public (development only)
const testWebhook = async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({ message: 'Not found' });
    }

    const { from = '+254112407259', text = 'HELP' } = req.body;
    
    const mockWebhookData = {
        from,
        text,
        to: process.env.ENEZA_SMS_SHORTCODE || 'PIXEL LTD.',
        date: new Date().toISOString(),
        id: `test_${Date.now()}`
    };

    // Process as if it came from the SMS provider
    req.body = mockWebhookData;
    return processIncomingSms(req, res);
};

module.exports = {
    processIncomingSms,
    testWebhook,
    commandHandlers, // Export for testing
    parseSmsCommand  // Export for testing
};