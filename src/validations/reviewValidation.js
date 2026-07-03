const { body, validationResult } = require('express-validator');

const createReviewRules = [
    body('routeId').isMongoId().withMessage('routeId không hợp lệ'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('rating phải từ 1 đến 5'),
    body('content').optional().trim(),
];

const updateReviewRules = [
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('rating phải từ 1 đến 5'),
    body('content').optional().trim(),
];

const listReviewRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải là số nguyên dương'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit từ 1-100'),
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('rating phải từ 1 đến 5'),
    body('sort').optional().isIn(['newest', 'oldest']).withMessage('sort phải là newest hoặc oldest'),
    body('routeId').optional().isMongoId().withMessage('routeId không hợp lệ'),
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
    createReviewRules,
    updateReviewRules,
    listReviewRules,
    idBodyRule,
    validate,
};
