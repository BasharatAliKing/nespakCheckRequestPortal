const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from token
        const user = await User.findById(decoded.id).select('-user_password');
        
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid', error: err.message });
    }
};

module.exports = authMiddleware;
