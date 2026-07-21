const { body } = require('express-validator');

const createReviewRules = [
    body('routeId').isMongoId().withMessage('routeId khÃ´ng há»£p lá»‡'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('rating pháº£i tá»« 1 Ä‘áº¿n 5'),
    body('content').optional().trim(),
];

const updateReviewRules = [
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('rating pháº£i tá»« 1 Ä‘áº¿n 5'),
    body('content').optional().trim(),
];

const listReviewRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page pháº£i lÃ  sá»‘ nguyÃªn dÆ°Æ¡ng'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit tá»« 1-100'),
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('rating pháº£i tá»« 1 Ä‘áº¿n 5'),
    body('sort').optional().isIn(['newest', 'oldest']).withMessage('sort pháº£i lÃ  newest hoáº·c oldest'),
    body('routeId').optional().isMongoId().withMessage('routeId khÃ´ng há»£p lá»‡'),
];

const reviewSummaryRules = [
    body('routeId').isMongoId().withMessage('routeId khÃ´ng há»£p lá»‡'),
];

const idBodyRule = [body('id').isMongoId().withMessage('ID khÃ´ng há»£p lá»‡')];

module.exports = {
    createReviewRules,
    updateReviewRules,
    listReviewRules,
    reviewSummaryRules,
    idBodyRule,
};
