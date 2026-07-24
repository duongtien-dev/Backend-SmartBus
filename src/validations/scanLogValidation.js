const { body } = require('express-validator');

const myScanLogsRules = [
    body('from').isISO8601().withMessage('from phải là ISO8601'),
    body('to').optional({ values: 'falsy' }).isISO8601().withMessage('to phải là ISO8601'),
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải >= 1'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit phải từ 1 đến 100')
];

module.exports = {
    myScanLogsRules
};
