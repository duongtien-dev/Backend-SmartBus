const { body } = require('express-validator');

const myScheduleRules = [
    body('from').optional({ values: 'falsy' }).isISO8601().withMessage('from phải là ISO8601'),
    body('to').optional({ values: 'falsy' }).isISO8601().withMessage('to phải là ISO8601')
];

const createScheduleRules = [
    body('staffId').isMongoId().withMessage('staffId không hợp lệ'),
    body('workDate').isISO8601().withMessage('workDate phải là ISO8601'),
    body('period')
        .optional()
        .isIn(['morning', 'afternoon', 'evening'])
        .withMessage('period phải là morning|afternoon|evening'),
    body('startTime').optional().isString().trim(),
    body('endTime').optional().isString().trim(),
    body('routeId').optional({ values: 'falsy' }).isMongoId().withMessage('routeId không hợp lệ'),
    body('routeName').optional().isString().trim(),
    body('routeCode').optional().isString().trim(),
    body('plateNumber').optional().isString().trim()
];

const listScheduleRules = [
    body('from').optional({ values: 'falsy' }).isISO8601().withMessage('from phải là ISO8601'),
    body('to').optional({ values: 'falsy' }).isISO8601().withMessage('to phải là ISO8601'),
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải >= 1'),
    body('limit').optional().toInt().isInt({ min: 1, max: 500 }).withMessage('limit phải từ 1 đến 500'),
    body('staffId').optional({ values: 'falsy' }).isMongoId().withMessage('staffId không hợp lệ'),
    body('routeId').optional({ values: 'falsy' }).isMongoId().withMessage('routeId không hợp lệ'),
    body('period')
        .optional()
        .isIn(['morning', 'afternoon', 'evening'])
        .withMessage('period phải là morning|afternoon|evening'),
    body('status')
        .optional()
        .isIn(['scheduled', 'in_progress', 'completed', 'cancelled'])
        .withMessage('status không hợp lệ')
];

const updateScheduleRules = [
    body('id').isMongoId().withMessage('ID không hợp lệ'),
    body('staffId').optional().isMongoId().withMessage('staffId không hợp lệ'),
    body('workDate').optional().isISO8601().withMessage('workDate phải là ISO8601'),
    body('period')
        .optional()
        .isIn(['morning', 'afternoon', 'evening'])
        .withMessage('period phải là morning|afternoon|evening'),
    body('startTime').optional().isString().trim(),
    body('endTime').optional().isString().trim(),
    body('routeId').optional({ values: 'falsy' }).isMongoId().withMessage('routeId không hợp lệ'),
    body('plateNumber').optional().isString().trim()
];

const idBodyRule = [body('id').isMongoId().withMessage('ID không hợp lệ')];

module.exports = {
    myScheduleRules,
    createScheduleRules,
    listScheduleRules,
    updateScheduleRules,
    idBodyRule
};
