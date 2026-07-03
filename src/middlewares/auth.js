const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

async function auth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại' });
        }
        req.user = user;
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
}

module.exports = auth;
