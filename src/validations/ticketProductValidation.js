const { body } = require('express-validator');
const { TICKET_PRODUCT_CODES } = require('../models/TicketProduct');

const createRules = [
    body('code')
        .isIn(TICKET_PRODUCT_CODES)
        .withMessage(`code phải là ${TICKET_PRODUCT_CODES.join(', ')}`),
    body('title').trim().notEmpty().withMessage('Tiêu đề không được để trống'),
    body('validity').optional().trim(),
    body('unitPrice').isFloat({ min: 0 }).withMessage('unitPrice phải >= 0').toFloat(),
    body('active').optional().isBoolean().withMessage('active phải là boolean'),
    body('sortOrder').optional().toInt().isInt({ min: 0 }).withMessage('sortOrder phải >= 0'),
];

const updateRules = [
    body('title').optional().trim().notEmpty().withMessage('Tiêu đề không được để trống'),
    body('validity').optional().trim(),
    body('unitPrice').optional().isFloat({ min: 0 }).withMessage('unitPrice phải >= 0').toFloat(),
    body('active').optional().isBoolean().withMessage('active phải là boolean'),
    body('sortOrder').optional().toInt().isInt({ min: 0 }).withMessage('sortOrder phải >= 0'),
];

const idBodyRule = [body('id').isMongoId().withMessage('ID không hợp lệ')];

module.exports = {
    createRules,
    updateRules,
    idBodyRule,
};
