const { body, validationResult } = require('express-validator');

const createStopRules = [
    body('routeId').isMongoId().withMessage('routeId không hợp lệ'),
    body('stopId').trim().notEmpty().withMessage('stopId không được để trống'),
    body('name').trim().notEmpty().withMessage('Tên điểm dừng không được để trống'),
    body('location').optional(),
    body('location.type').optional().isIn(['Point']),
    body('location.coordinates').optional().isArray(),
    body('times').optional().isArray(),
    body('order').optional().isInt({ min: 0 }),
];

const updateStopRules = [
    body('stopId').optional().trim().notEmpty().withMessage('stopId không được để trống'),
    body('name').optional().trim().notEmpty().withMessage('Tên điểm dừng không được để trống'),
    body('location').optional(),
    body('location.type').optional().isIn(['Point']),
    body('location.coordinates').optional().isArray(),
    body('times').optional().isArray(),
    body('order').optional().isInt({ min: 0 }),
];

const listStopsByRouteRules = [
    body('routeId').isMongoId().withMessage('routeId không hợp lệ'),
    body('page').optional().toInt().isInt({ min: 1 }),
    body('limit').optional().toInt().isInt({ min: 1, max: 200 }),
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
    createStopRules,
    updateStopRules,
    listStopsByRouteRules,
    idBodyRule,
    validate,
};
