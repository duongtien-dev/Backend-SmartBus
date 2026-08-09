const { body } = require('express-validator');

const checkInRules = [
    body('scheduleId')
        .optional({ values: 'falsy' })
        .isMongoId()
        .withMessage('scheduleId không hợp lệ'),
    body('routeId').optional({ values: 'falsy' }).isMongoId().withMessage('routeId không hợp lệ'),
    body('routeName').optional().isString().trim(),
    body('routeCode').optional().isString().trim(),
    body('plateNumber').optional().isString().trim(),
    body('vehicleId').optional({ values: 'falsy' }).isMongoId().withMessage('vehicleId không hợp lệ'),
];

const locationRules = [
    body('lat').isFloat({ min: -90, max: 90 }).withMessage('lat không hợp lệ').toFloat(),
    body('lng').isFloat({ min: -180, max: 180 }).withMessage('lng không hợp lệ').toFloat(),
    body('heading').optional({ values: 'null' }).isFloat().withMessage('heading không hợp lệ').toFloat(),
    body('currentStopOrder')
        .optional({ values: 'null' })
        .isInt({ min: 0 })
        .withMessage('currentStopOrder phải >= 0')
        .toInt(),
];

const advanceStopRules = [
    body('stopIndex')
        .optional({ values: 'null' })
        .isInt({ min: 0 })
        .withMessage('stopIndex phải >= 0')
        .toInt(),
];

module.exports = {
    checkInRules,
    locationRules,
    advanceStopRules,
};
