const userService = require('../services/userService');

async function register(req, res) {
    try {
        const result = await userService.register(req.body);
        res.json({ success: true, message: 'Gửi OTP đăng ký thành công', data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function registerVerifyOtp(req, res) {
    try {
        const result = await userService.registerVerifyOtp(req.body);
        res.status(201).json({ success: true, message: 'Đăng ký tài khoản thành công', data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const result = await userService.login(email, password);
        res.json({ success: true, message: 'Đăng nhập thành công', data: result });
    } catch (err) {
        res.status(401).json({ success: false, message: err.message });
    }
}

async function sendForgotPasswordOtp(req, res) {
    try {
        const result = await userService.sendForgotPasswordOtp(req.body.email);
        res.json({ success: true, message: 'Gửi OTP quên mật khẩu thành công', data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function resetPasswordWithOtp(req, res) {
    try {
        const result = await userService.resetPasswordWithOtp(req.body);
        res.json({ success: true, message: 'Đặt lại mật khẩu thành công', data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function updateUser(req, res) {
    try {
        const user = await userService.updateUser(req.user._id, req.body);
        res.json({ success: true, message: 'Cập nhật thông tin người dùng thành công', data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    register,
    registerVerifyOtp,
    login,
    sendForgotPasswordOtp,
    resetPasswordWithOtp,
    updateUser,
};
