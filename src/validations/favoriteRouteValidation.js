const { body } = require('express-validator');

const routeIdBodyRule = [
    body('routeId').isMongoId().withMessage('routeId không hợp lệ'),
];

const listFavoriteRules = [
    body('page')
        .optional()
        .toInt()
        .isInt({ min: 1 })
        .withMessage('page phải là số nguyên dương'),
    body('limit')
        .optional()
        .toInt()
        .isInt({ min: 1, max: 100 })
        .withMessage('limit từ 1-100'),
    body('search').optional().trim(),
    body('sort')
        .optional()
        .isIn(['newest', 'oldest'])
        .withMessage('sort phải là newest hoặc oldest'),
];

module.exports = {
    routeIdBodyRule,
    listFavoriteRules,
};
