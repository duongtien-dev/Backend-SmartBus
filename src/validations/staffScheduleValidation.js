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

module.exports = {
    myScheduleRules,
    createScheduleRules
};
