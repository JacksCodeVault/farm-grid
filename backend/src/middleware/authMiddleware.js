// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../db/database'); // Assuming you have a database connection
const config = require('../config/config');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, config.jwtSecret);

            // Attach user to the request
            req.user = await db('users').where({ id: decoded.id }).first();
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
