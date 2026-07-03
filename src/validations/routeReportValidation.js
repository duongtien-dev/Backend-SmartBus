const { body, validationResult } = require('express-validator');

const createRouteReportRules = [
    body('routeId').isMongoId().withMessage('routeId không hợp lệ'),
    body('type')
        .optional()
        .isIn(['issue', 'suggestion', 'complaint', 'other'])
        .withMessage('type phải là issue, suggestion, complaint hoặc other'),
    body('content').trim().notEmpty().withMessage('Nội dung không được để trống'),
    body('phone').optional().trim(),
];

const updateRouteReportRules = [
    body('type')
        .optional()
        .isIn(['issue', 'suggestion', 'complaint', 'other'])
        .withMessage('type phải là issue, suggestion, complaint hoặc other'),
    body('content').optional().trim().notEmpty().withMessage('Nội dung không được để trống'),
    body('phone').optional().trim(),
    body('status')
        .optional()
        .isIn(['new', 'in_progress', 'resolved', 'rejected'])
        .withMessage('status phải là new, in_progress, resolved hoặc rejected'),
];

const listRouteReportRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải là số nguyên dương'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit từ 1-100'),
    body('search').optional().trim(),
    body('sort').optional().isIn(['newest', 'oldest']).withMessage('sort phải là newest hoặc oldest'),
    body('userId').optional().isMongoId().withMessage('userId không hợp lệ'),
    body('status')
        .optional()
        .isIn(['new', 'in_progress', 'resolved', 'rejected'])
        .withMessage('status không hợp lệ'),
    body('type')
        .optional()
        .isIn(['issue', 'suggestion', 'complaint', 'other'])
        .withMessage('type không hợp lệ'),
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
    createRouteReportRules,
    updateRouteReportRules,
    listRouteReportRules,
    idBodyRule,
    validate,
};
