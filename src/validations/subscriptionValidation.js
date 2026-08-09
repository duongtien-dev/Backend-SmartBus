const { body } = require('express-validator');

const registerDeviceRules = [
    body('token').trim().notEmpty().withMessage('token là bắt buộc'),
    body('platform')
        .optional()
        .isIn(['ios', 'android', 'web', 'expo'])
        .withMessage('platform không hợp lệ'),
];

const upsertSubscriptionRules = [
    body('routeId').isMongoId().withMessage('routeId không hợp lệ'),
    body('stopId').isMongoId().withMessage('stopId không hợp lệ'),
    body('notifyBeforeMinutes')
        .optional()
        .isInt({ min: 1, max: 60 })
        .withMessage('notifyBeforeMinutes phải từ 1–60')
        .toInt(),
    body('active').optional().isBoolean().withMessage('active phải là boolean').toBoolean(),
];

const deleteSubscriptionRules = [
    body('id').optional({ values: 'falsy' }).isMongoId().withMessage('id không hợp lệ'),
    body('routeId').optional({ values: 'falsy' }).isMongoId().withMessage('routeId không hợp lệ'),
    body('stopId').optional({ values: 'falsy' }).isMongoId().withMessage('stopId không hợp lệ'),
];

module.exports = {
    registerDeviceRules,
    upsertSubscriptionRules,
    deleteSubscriptionRules,
};
