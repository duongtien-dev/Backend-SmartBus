const { body, validationResult } = require('express-validator');

const providerValues = ['momo', 'zalopay', 'shopeepay', 'visa', 'napas'];

const createPaymentMethodRules = [
    body('provider')
        .trim()
        .isIn(providerValues)
        .withMessage('provider phải là momo, zalopay, shopeepay, visa hoặc napas'),
    body('cardNumber').optional({ nullable: true }).trim(),
    body('expiryDate').optional({ nullable: true }).trim(),
    body('csc').optional({ nullable: true }).trim(),
    body('cardHolderName').optional({ nullable: true }).trim(),
    body('bankName').optional({ nullable: true }).trim(),
    body('cccd').optional({ nullable: true }).trim(),
    body('accountNumber').optional({ nullable: true }).trim(),
    body('phoneNumber').optional({ nullable: true }).trim(),
    body('email').optional({ nullable: true }).trim().isEmail().withMessage('Email không hợp lệ'),
];

const updatePaymentMethodRules = [
    body('provider')
        .optional()
        .trim()
        .isIn(providerValues)
        .withMessage('provider phải là momo, zalopay, shopeepay, visa hoặc napas'),
    body('cardNumber').optional({ nullable: true }).trim(),
    body('expiryDate').optional({ nullable: true }).trim(),
    body('csc').optional({ nullable: true }).trim(),
    body('cardHolderName').optional({ nullable: true }).trim(),
    body('bankName').optional({ nullable: true }).trim(),
    body('cccd').optional({ nullable: true }).trim(),
    body('accountNumber').optional({ nullable: true }).trim(),
    body('phoneNumber').optional({ nullable: true }).trim(),
    body('email').optional({ nullable: true }).trim().isEmail().withMessage('Email không hợp lệ'),
];

const idBodyRule = [body('id').isMongoId().withMessage('ID không hợp lệ')];

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
}

module.exports = {
    createPaymentMethodRules,
    updatePaymentMethodRules,
    idBodyRule,
    validate,
};
