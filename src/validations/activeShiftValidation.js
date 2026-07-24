const { body } = require('express-validator');

const checkInRules = [
    body('scheduleId')
        .optional({ values: 'falsy' })
        .isMongoId()
        .withMessage('scheduleId không hợp lệ'),
    body('routeId').optional({ values: 'falsy' }).isMongoId().withMessage('routeId không hợp lệ'),
    body('routeName').optional().isString().trim(),
    body('routeCode').optional().isString().trim()
];

module.exports = {
    checkInRules
};
