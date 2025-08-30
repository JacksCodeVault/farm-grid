// src/services/smsService.js
require('dotenv').config();
const config = require('../config/config');
const axios = require('axios');

const ENEZA_SMS_API_URL = process.env.ENEZA_SMS_API_URL;
const ENEZA_SMS_BULK_API_URL = process.env.ENEZA_SMS_BULK_API_URL;
const ENEZA_SMS_API_KEY = process.env.ENEZA_SMS_API_KEY;
const ENEZA_SMS_PARTNER_ID = process.env.ENEZA_SMS_PARTNER_ID;
const ENEZA_SMS_SHORTCODE = process.env.ENEZA_SMS_SHORTCODE;

// Phone number validation regex patterns
const PHONE_REGEX = {
    // Kenyan phone numbers: +254XXXXXXXXX, 254XXXXXXXXX, 07XXXXXXXX, 01XXXXXXXX
    KENYAN: /^(\+254|254|0)[17]\d{8}$/,
    // International format: +[country code][number]
    INTERNATIONAL: /^\+\d{1,4}\d{4,14}$/,
    // General format for any digits (fallback)
    GENERAL: /^\+?\d{9,15}$/
};

/**
 * Validates if a phone number is in valid Kenyan format
 * @param {string} mobile - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidKenyanPhone = (mobile) => {
    if (!mobile || typeof mobile !== 'string') return false;
    return PHONE_REGEX.KENYAN.test(mobile.trim());
};

/**
 * Validates if a phone number is in valid international format
 * @param {string} mobile - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidInternationalPhone = (mobile) => {
    if (!mobile || typeof mobile !== 'string') return false;
    return PHONE_REGEX.INTERNATIONAL.test(mobile.trim()) || PHONE_REGEX.GENERAL.test(mobile.trim());
};

/**
 * Formats a Kenyan phone number to the standard format (254XXXXXXXXX)
 * @param {string} mobile - Phone number to format
 * @returns {string} - Formatted phone number
 */
const formatKenyanPhoneNumber = (mobile) => {
    if (!mobile) throw new Error('Phone number is required');
    
    // Remove all non-digit characters except +
    let cleaned = mobile.toString().replace(/[^\d+]/g, '');
    
    // Handle different Kenyan number formats
    if (cleaned.startsWith('+254')) {
        // +254XXXXXXXXX -> 254XXXXXXXXX
        return cleaned.substring(1);
    } else if (cleaned.startsWith('254')) {
        // 254XXXXXXXXX -> keep as is
        return cleaned;
    } else if (cleaned.startsWith('0')) {
        // 07XXXXXXXX or 01XXXXXXXX -> 254XXXXXXXXX
        return '254' + cleaned.substring(1);
    } else if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
        // 7XXXXXXXX or 1XXXXXXXX -> 254XXXXXXXXX
        return '254' + cleaned;
    }
    
    // If none of the above, throw an error
    throw new Error(`Invalid Kenyan phone number format: ${mobile}`);
};

/**
 * Formats an international phone number
 * @param {string} mobile - Phone number to format
 * @returns {string} - Formatted phone number
 */
const formatInternationalPhoneNumber = (mobile) => {
    if (!mobile) throw new Error('Phone number is required');
    
    // Remove all non-digit characters except +
    let cleaned = mobile.toString().replace(/[^\d+]/g, '');
    
    // If it starts with +, remove it for the API
    if (cleaned.startsWith('+')) {
        return cleaned.substring(1);
    }
    
    return cleaned;
};

/**
 * Smart phone number formatter that detects and formats appropriately
 * @param {string} mobile - Phone number to format
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (mobile) => {
    try {
        if (isValidKenyanPhone(mobile)) {
            return formatKenyanPhoneNumber(mobile);
        } else if (isValidInternationalPhone(mobile)) {
            return formatInternationalPhoneNumber(mobile);
        } else {
            throw new Error(`Invalid phone number format: ${mobile}`);
        }
    } catch (error) {
        console.error('Phone number formatting error:', error.message);
        throw error;
    }
};

/**
 * Validates message content
 * @param {string} message - Message to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidMessage = (message) => {
    if (!message || typeof message !== 'string') return false;
    const trimmed = message.trim();
    return trimmed.length > 0 && trimmed.length <= 1600; // SMS length limit
};

/**
 * Send single SMS (POST)
 * @param {string} mobile - Recipient phone number
 * @param {string} message - Message content
 * @param {string} timeToSend - Optional scheduled time
 * @returns {Promise<Object>} - Response object with success status and data
 */
const sendSms = async (mobile, message, timeToSend = null) => {
    try {
        // Validate inputs
        if (!isValidMessage(message)) {
            throw new Error('Invalid message: Message must be between 1-1600 characters');
        }

        const formattedMobile = formatPhoneNumber(mobile);
        
        const payload = {
            apikey: ENEZA_SMS_API_KEY,
            partnerID: ENEZA_SMS_PARTNER_ID,
            message: message.trim(),
            shortcode: ENEZA_SMS_SHORTCODE,
            mobile: formattedMobile
        };

        // Add scheduled time if provided
        if (timeToSend) {
            payload.timeToSend = timeToSend;
        }

        console.log(`📱 Sending SMS to ${formattedMobile}...`);
        
        const response = await axios.post(ENEZA_SMS_API_URL, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data && response.data.responses && response.data.responses[0]['response-code'] === 200) {
            console.log('✅ SMS sent successfully:', response.data);
            return {
                success: true,
                data: response.data,
                messageId: response.data.responses[0].messageid,
                mobile: formattedMobile
            };
        } else {
            console.error('❌ SMS sending failed:', response.data);
            return {
                success: false,
                error: response.data,
                mobile: formattedMobile
            };
        }
    } catch (error) {
        const errorMessage = error.response?.data || error.message;
        console.error('❌ Error sending SMS:', errorMessage);
        return {
            success: false,
            error: errorMessage,
            mobile: mobile
        };
    }
};

/**
 * Send bulk SMS
 * @param {Array} smsList - Array of {mobile, message} objects
 * @returns {Promise<Object>} - Response object with success status and data
 */
const sendBulkSms = async (smsList) => {
    try {
        if (!Array.isArray(smsList) || smsList.length === 0) {
            throw new Error('SMS list must be a non-empty array');
        }

        if (smsList.length > 1000) {
            throw new Error('Maximum 1000 SMS messages allowed per bulk request');
        }

        // Validate and format all SMS entries
        const formattedSmsList = smsList.map((sms, index) => {
            if (!sms.mobile || !sms.message) {
                throw new Error(`Invalid SMS at index ${index}: mobile and message are required`);
            }

            if (!isValidMessage(sms.message)) {
                throw new Error(`Invalid message at index ${index}: Message must be between 1-1600 characters`);
            }

            return {
                ...sms,
                mobile: formatPhoneNumber(sms.mobile),
                message: sms.message.trim()
            };
        });

        const payload = {
            count: formattedSmsList.length,
            smslist: formattedSmsList.map((sms, idx) => ({
                partnerID: ENEZA_SMS_PARTNER_ID,
                apikey: ENEZA_SMS_API_KEY,
                pass_type: 'plain',
                clientsmsid: idx + 1,
                mobile: sms.mobile,
                message: sms.message,
                shortcode: ENEZA_SMS_SHORTCODE,
                ...(sms.timeToSend && { timeToSend: sms.timeToSend })
            }))
        };

        console.log(`📱 Sending bulk SMS to ${formattedSmsList.length} recipients...`);

        const response = await axios.post(ENEZA_SMS_BULK_API_URL, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data && response.data.responses && response.data.responses.every(r => r['response-code'] === 200)) {
            console.log('✅ Bulk SMS sent successfully:', response.data);
            return {
                success: true,
                data: response.data,
                totalSent: formattedSmsList.length,
                responses: response.data.responses
            };
        } else {
            console.error('❌ Bulk SMS sending failed:', response.data);
            return {
                success: false,
                error: response.data,
                totalRequested: formattedSmsList.length
            };
        }
    } catch (error) {
        const errorMessage = error.response?.data || error.message;
        console.error('❌ Error sending bulk SMS:', errorMessage);
        return {
            success: false,
            error: errorMessage,
            totalRequested: smsList?.length || 0
        };
    }
};

/**
 * Send OTP SMS
 * @param {string} mobile - Recipient phone number
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} - Response object with success status and data
 */
const sendOtp = async (mobile, otp) => {
    if (!otp || otp.toString().trim().length === 0) {
        throw new Error('OTP code is required');
    }

    const message = `Your FarmGrid verification code is: ${otp}. Do not share this code with anyone. Valid for 10 minutes.`;
    return sendSms(mobile, message);
};

/**
 * Send welcome SMS
 * @param {string} mobile - Recipient phone number
 * @param {string} name - User's name
 * @returns {Promise<Object>} - Response object with success status and data
 */
const sendWelcomeSms = async (mobile, name = 'User') => {
    const message = `Welcome to FarmGrid, ${name}! Your account has been successfully created. Start managing your farm operations today.`;
    return sendSms(mobile, message);
};

/**
 * Send password reset SMS
 * @param {string} mobile - Recipient phone number
 * @param {string} resetCode - Password reset code
 * @returns {Promise<Object>} - Response object with success status and data
 */
const sendPasswordResetSms = async (mobile, resetCode) => {
    if (!resetCode || resetCode.toString().trim().length === 0) {
        throw new Error('Reset code is required');
    }

    const message = `Your FarmGrid password reset code is: ${resetCode}. Use this code to reset your password. Valid for 15 minutes.`;
    return sendSms(mobile, message);
};

module.exports = {
    // Core SMS functions
    sendSms,
    sendBulkSms,
    
    // Specialized SMS functions
    sendOtp,
    sendWelcomeSms,
    sendPasswordResetSms,
    
    // Utility functions
    formatPhoneNumber,
    isValidKenyanPhone,
    isValidInternationalPhone,
    isValidMessage,
    
    // Constants
    PHONE_REGEX
};