const { body } = require('express-validator');

const providerValues = ['momo', 'zalopay', 'shopeepay', 'visa', 'napas'];

const createPaymentMethodRules = [
    body('provider')
        .trim()
        .isIn(providerValues)
        .withMessage('provider pháº£i lÃ  momo, zalopay, shopeepay, visa hoáº·c napas'),
    body('cardNumber').optional({ nullable: true }).trim(),
    body('expiryDate').optional({ nullable: true }).trim(),
    body('csc').optional({ nullable: true }).trim(),
    body('cardHolderName').optional({ nullable: true }).trim(),
    body('bankName').optional({ nullable: true }).trim(),
    body('cccd').optional({ nullable: true }).trim(),
    body('accountNumber').optional({ nullable: true }).trim(),
    body('phoneNumber').optional({ nullable: true }).trim(),
    body('email').optional({ nullable: true }).trim().isEmail().withMessage('Email khÃ´ng há»£p lá»‡'),
];

const updatePaymentMethodRules = [
    body('provider')
        .optional()
        .trim()
        .isIn(providerValues)
        .withMessage('provider pháº£i lÃ  momo, zalopay, shopeepay, visa hoáº·c napas'),
    body('cardNumber').optional({ nullable: true }).trim(),
    body('expiryDate').optional({ nullable: true }).trim(),
    body('csc').optional({ nullable: true }).trim(),
    body('cardHolderName').optional({ nullable: true }).trim(),
    body('bankName').optional({ nullable: true }).trim(),
    body('cccd').optional({ nullable: true }).trim(),
    body('accountNumber').optional({ nullable: true }).trim(),
    body('phoneNumber').optional({ nullable: true }).trim(),
    body('email').optional({ nullable: true }).trim().isEmail().withMessage('Email khÃ´ng há»£p lá»‡'),
];

const idBodyRule = [body('id').isMongoId().withMessage('ID khÃ´ng há»£p lá»‡')];

module.exports = {
    createPaymentMethodRules,
    updatePaymentMethodRules,
    idBodyRule,
};
