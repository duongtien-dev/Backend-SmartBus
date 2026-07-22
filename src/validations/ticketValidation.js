const { body } = require('express-validator');

const ticketTypeValues = ['single', 'monthlySingleRoute', 'monthlyInterRoute'];
const ticketStatusValues = ['pending', 'paid', 'active', 'used', 'expired', 'cancelled'];

const createTicketRules = [
    body('routeId').isMongoId().withMessage('routeId không hợp lệ'),
    body('routeName').trim().notEmpty().withMessage('routeName là bắt buộc'),
    body('startStopName').trim().notEmpty().withMessage('startStopName là bắt buộc'),
    body('endStopName').trim().notEmpty().withMessage('endStopName là bắt buộc'),
    body('ticketType')
        .trim()
        .isIn(ticketTypeValues)
        .withMessage('ticketType phải là single, monthlySingleRoute hoặc monthlyInterRoute'),
    body('departureDate')
        .isISO8601()
        .withMessage('departureDate không hợp lệ')
        .toDate(),
    body('departureTime')
        .trim()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('departureTime phải theo định dạng HH:mm'),
    body('seatQuantity')
        .isInt({ min: 1 })
        .withMessage('seatQuantity phải >= 1')
        .toInt(),
    body('customerName').trim().notEmpty().withMessage('customerName là bắt buộc'),
    body('customerPhone').trim().notEmpty().withMessage('customerPhone là bắt buộc'),
    body('paymentMethodId').isMongoId().withMessage('paymentMethodId không hợp lệ'),
    body('price').isFloat({ min: 0 }).withMessage('price phải >= 0').toFloat()
];

const verifyScannedQrRules = [
    body('qrCode')
        .trim()
        .notEmpty()
        .withMessage('qrCode là bắt buộc')
        .isLength({ min: 5, max: 255 })
        .withMessage('qrCode không hợp lệ')
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

const idBodyRule = [body('id').isMongoId().withMessage('ID không hợp lệ')];

module.exports = {
    createTicketRules,
    verifyScannedQrRules,
    myTicketsBodyRules,
    idBodyRule,
};
