const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

/** Gắn req.user nếu có token hợp lệ; không có token thì vẫn next(). */
async function optionalAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(decoded.userId);
        if (user) {
            req.user = user;
        }
    } catch {
        // Token không hợp lệ — bỏ qua, coi như khách
    }
    return next();
}

module.exports = optionalAuth;
