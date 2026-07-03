const { body, validationResult } = require('express-validator');

const listUserRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải là số nguyên dương'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit từ 1-100'),
    body('search').optional().trim(),
    body('role')
        .optional()
        .custom((val) => val === '' || val === undefined || ['admin', 'staff', 'user'].includes(val))
        .withMessage('role phải là admin, staff hoặc user'),
    body('is_priority_user').optional().isBoolean().withMessage('is_priority_user phải là true/false'),
    body('active').optional().isBoolean().withMessage('active phải là true/false'),
];

const updateActiveRules = [
    body('active').isBoolean().withMessage('active phải là true hoặc false'),
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
    listUserRules,
    updateActiveRules,
    idBodyRule,
    validate,
};
