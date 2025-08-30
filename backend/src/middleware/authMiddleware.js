const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../db/database');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, config.jwt.secret);

            // Attach user to the request
            req.user = await db('users').where({ id: decoded.id }).select('id', 'name', 'email', 'role', 'organization_id').first();

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

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

const authorize = (...roles) => {
    return (req, res, next) => {
        // Flatten the roles array if it's nested (e.g., authorize(['ADMIN']))
        const allowedRoles = roles.flat();

        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route` });
        }
        next();
    };
};

module.exports = { protect, authorize };
