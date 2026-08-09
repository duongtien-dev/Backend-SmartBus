const { body } = require('express-validator');

const routeVehiclesRules = [
    body('routeId').isMongoId().withMessage('routeId không hợp lệ'),
    body('stopId').optional({ values: 'falsy' }).isMongoId().withMessage('stopId không hợp lệ'),
];

const etaRules = [
    body('routeId').isMongoId().withMessage('routeId không hợp lệ'),
    body('stopId').isMongoId().withMessage('stopId không hợp lệ'),
];

const crowdingRules = [
    body('routeId').isMongoId().withMessage('routeId không hợp lệ'),
];

const vehicleGpsRules = [
    body('plateNumber').trim().notEmpty().withMessage('plateNumber là bắt buộc'),
    body('lat').isFloat({ min: -90, max: 90 }).withMessage('lat không hợp lệ'),
    body('lng').isFloat({ min: -180, max: 180 }).withMessage('lng không hợp lệ'),
    body('heading').optional({ values: 'falsy' }).isFloat(),
    body('currentStopOrder').optional({ values: 'falsy' }).isInt({ min: 0 }),
    body('deviceKey').optional({ values: 'falsy' }).isString(),
];

module.exports = {
    routeVehiclesRules,
    etaRules,
    crowdingRules,
    vehicleGpsRules,
};
