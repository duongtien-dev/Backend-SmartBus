const { body } = require('express-validator');

const listUserRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page pháº£i lÃ  sá»‘ nguyÃªn dÆ°Æ¡ng'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit tá»« 1-100'),
    body('search').optional().trim(),
    body('role')
        .optional()
        .custom((val) => val === '' || val === undefined || ['admin', 'staff', 'user'].includes(val))
        .withMessage('role pháº£i lÃ  admin, staff hoáº·c user'),
    body('is_priority_user').optional().isBoolean().withMessage('is_priority_user pháº£i lÃ  true/false'),
    body('active').optional().isBoolean().withMessage('active pháº£i lÃ  true/false'),
];

const updateActiveRules = [
    body('active').isBoolean().withMessage('active pháº£i lÃ  true hoáº·c false'),
];

const idBodyRule = [body('id').isMongoId().withMessage('ID khÃ´ng há»£p lá»‡')];

module.exports = {
    listUserRules,
    updateActiveRules,
    idBodyRule,
};
