const { body, validationResult } = require('express-validator');

const createPostRules = [
    body('title').trim().notEmpty().withMessage('Tiêu đề không được để trống'),
    body('summary').optional().trim(),
    body('content').optional().trim(),
    body('thumbnail').optional().trim(),
    body('images').optional().isArray().withMessage('images phải là mảng'),
    body('category').optional().trim(),
    body('related_routes').optional().isArray(),
    body('related_stops').optional().isArray(),
];

const updatePostRules = [
    body('title').optional().trim().notEmpty().withMessage('Tiêu đề không được để trống'),
    body('summary').optional().trim(),
    body('content').optional().trim(),
    body('thumbnail').optional().trim(),
    body('images').optional().isArray(),
    body('category').optional().trim(),
    body('related_routes').optional().isArray(),
    body('related_stops').optional().isArray(),
];

const listPostRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải là số nguyên dương'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit từ 1-100'),
    body('search').optional().trim(),
    body('sort').optional().isIn(['newest', 'oldest']).withMessage('sort phải là newest hoặc oldest'),
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
    createPostRules,
    updatePostRules,
    listPostRules,
    idBodyRule,
    validate,
};
