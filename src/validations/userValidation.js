const { body } = require('express-validator');

const registerRules = [
    body('full_name').trim().notEmpty().withMessage('Họ tên không được để trống'),
    body('email').trim().isEmail().withMessage('Email không hợp lệ'),
    body('phone').trim().notEmpty().withMessage('Số điện thoại không được để trống'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('password_confirm')
        .custom((val, { req }) => val === req.body.password)
        .withMessage('Xác nhận mật khẩu không khớp'),
];

const registerVerifyOtpRules = [
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP phải có 6 chữ số'),
];

const loginRules = [
    body('email').trim().isEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
];

const forgotPasswordSendOtpRules = [
    body('email').trim().isEmail().withMessage('Email không hợp lệ'),
];

const forgotPasswordResetRules = [
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP phải có 6 chữ số'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
    body('newPassword_confirm')
        .custom((val, { req }) => val === req.body.newPassword)
        .withMessage('Xác nhận mật khẩu không khớp'),
];

const updateUserRules = [
    body('full_name').optional().trim(),
    body('email').optional().trim().isEmail().withMessage('Email không hợp lệ'),
    body('phone').optional().trim(),
    body('gender').optional().trim(),
    body('date_of_birth').optional().toDate(),
    body('occupation').optional().trim(),
    body('province').optional().trim(),
    body('district').optional().trim(),
    body('ward').optional().trim(),
    body('address_detail').optional().trim(),
    body('priority_user').optional().trim(),
    // bắt buộc phải là ảnh url
    body('image_proof').optional().trim().isURL().withMessage('Ảnh phải là URL'),
    body('password').optional().isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
];

module.exports = {
    registerRules,
    registerVerifyOtpRules,
    loginRules,
    forgotPasswordSendOtpRules,
    forgotPasswordResetRules,
    updateUserRules,
};
