const { body } = require('express-validator');

const ticketTypeValues = ['single', 'monthlySingleRoute', 'monthlyInterRoute'];
const ticketStatusValues = ['pending', 'paid', 'active', 'used', 'expired', 'cancelled'];

const createTicketRules = [
    body('routeId').isMongoId().withMessage('routeId không hợp lệ'),
    body('startStopName').trim().notEmpty().withMessage('startStopName là bắt buộc'),
    body('endStopName').trim().notEmpty().withMessage('endStopName là bắt buộc'),
    body('ticketType')
        .trim()
        .isIn(ticketTypeValues)
        .withMessage('ticketType phải là single, monthlySingleRoute hoặc monthlyInterRoute'),
    // Service parse ISO / DD/MM/YYYY / MM/YYYY
    body('departureDate').trim().notEmpty().withMessage('departureDate là bắt buộc'),
    body('departureTime')
        .optional({ values: 'falsy' })
        .trim()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('departureTime phải theo định dạng HH:mm'),
    body('seatQuantity')
        .isInt({ min: 1 })
        .withMessage('seatQuantity phải >= 1')
        .toInt(),
    body('customerName').optional({ values: 'falsy' }).trim(),
    body('customerPhone').optional({ values: 'falsy' }).trim(),
    body('paymentMethodId').isMongoId().withMessage('paymentMethodId không hợp lệ'),
    // routeName, price, customer* (fallback User) do server set
];

const verifyScannedQrRules = [
    body('qrCode')
        .trim()
        .notEmpty()
        .withMessage('qrCode là bắt buộc')
        .isLength({ min: 5, max: 255 })
        .withMessage('qrCode không hợp lệ'),
    body('shiftId').optional({ values: 'falsy' }).isMongoId().withMessage('shiftId không hợp lệ'),
    body('stopId').optional({ values: 'falsy' }).isMongoId().withMessage('stopId không hợp lệ'),
    body('lat').optional({ values: 'null' }).isFloat({ min: -90, max: 90 }).toFloat(),
    body('lng').optional({ values: 'null' }).isFloat({ min: -180, max: 180 }).toFloat(),
];

const myTicketsBodyRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải >= 1'),
    body('limit').optional().toInt().isInt({ min: 1, max: 20 }).withMessage('limit phải từ 1 đến 20'),
    body('status')
        .optional()
        .isIn(ticketStatusValues)
        .withMessage('status không hợp lệ'),
    body('ticketType')
        .optional()
        .isIn(ticketTypeValues)
        .withMessage('ticketType phải là single, monthlySingleRoute hoặc monthlyInterRoute'),
    body('includeQr')
        .optional()
        .isBoolean()
        .withMessage('includeQr phải là boolean')
        .toBoolean(),
    body('onlyAvailableQr')
        .optional()
        .isBoolean()
        .withMessage('onlyAvailableQr phải là boolean')
        .toBoolean()
];

const historyBodyRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải >= 1'),
    body('limit').optional().toInt().isInt({ min: 1, max: 20 }).withMessage('limit phải từ 1 đến 20')
];

const idBodyRule = [body('id').isMongoId().withMessage('ID không hợp lệ')];

module.exports = {
    createTicketRules,
    verifyScannedQrRules,
    myTicketsBodyRules,
    historyBodyRules,
    idBodyRule,
};
