const { body, param } = require('express-validator');

const registerRules = [
    body('full_name').trim().notEmpty().withMessage('Há» tÃªn khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('email').trim().isEmail().withMessage('Email khÃ´ng há»£p lá»‡'),
    body('phone').trim().notEmpty().withMessage('Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±'),
    body('password_confirm')
        .custom((val, { req }) => val === req.body.password)
        .withMessage('XÃ¡c nháº­n máº­t kháº©u khÃ´ng khá»›p'),
];

const registerVerifyOtpRules = [
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP pháº£i cÃ³ 6 chá»¯ sá»‘'),
];

const loginRules = [
    body('email').trim().isEmail().withMessage('Email khÃ´ng há»£p lá»‡'),
    body('password').notEmpty().withMessage('Máº­t kháº©u khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
];

const forgotPasswordSendOtpRules = [
    body('email').trim().isEmail().withMessage('Email khÃ´ng há»£p lá»‡'),
];

const forgotPasswordResetRules = [
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP pháº£i cÃ³ 6 chá»¯ sá»‘'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Máº­t kháº©u má»›i pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±'),
    body('newPassword_confirm')
        .custom((val, { req }) => val === req.body.newPassword)
        .withMessage('XÃ¡c nháº­n máº­t kháº©u khÃ´ng khá»›p'),
];

const updateUserRules = [
    body('full_name').optional().trim(),
    body('email').optional().trim().isEmail().withMessage('Email khÃ´ng há»£p lá»‡'),
    body('phone').optional().trim(),
    body('gender').optional().trim(),
    body('date_of_birth').optional().toDate(),
    body('occupation').optional().trim(),
    body('province').optional().trim(),
    body('district').optional().trim(),
    body('ward').optional().trim(),
    body('address_detail').optional().trim(),
    body('priority_user').optional().trim(),
    // báº¯t buá»™c pháº£i lÃ  áº£nh url
    body('image_proof').optional().trim().isURL().withMessage('áº¢nh pháº£i lÃ  URL'),
    body('password').optional().isLength({ min: 6 }).withMessage('Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±'),
];

module.exports = {
    registerRules,
    registerVerifyOtpRules,
    loginRules,
    forgotPasswordSendOtpRules,
    forgotPasswordResetRules,
    updateUserRules,
};
