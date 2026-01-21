const jwt = require('jsonwebtoken');

// Secret for JWT (should match auth.js)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

// Middleware to verify JWT token
module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
