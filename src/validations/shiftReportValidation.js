const { body, validationResult } = require('express-validator');

const shiftStatusValues = ['submitted', 'approved', 'rejected'];

const previewAndSubmitRules = [
    body('shiftStartAt').isISO8601().withMessage('shiftStartAt không hợp lệ').toDate(),
    body('shiftEndAt').isISO8601().withMessage('shiftEndAt không hợp lệ').toDate(),
    body('note').optional().isString().withMessage('note phải là chuỗi').trim(),
    body('shiftEndAt').custom((value, { req }) => {
        const start = new Date(req.body.shiftStartAt);
        const end = new Date(value);
        if (start.getTime() >= end.getTime()) {
            throw new Error('shiftStartAt phải nhỏ hơn shiftEndAt');
        }
        return true;
    })
];

const myReportBodyRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải >= 1'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit phải từ 1 đến 100'),
    body('status')
        .optional()
        .isIn(shiftStatusValues)
        .withMessage('status phải là submitted, approved hoặc rejected')
];

const adminListBodyRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải >= 1'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit phải từ 1 đến 100'),
    body('status')
        .optional()
        .isIn(shiftStatusValues)
        .withMessage('status phải là submitted, approved hoặc rejected'),
    body('staffId').optional().isMongoId().withMessage('staffId không hợp lệ')
];

const reviewRules = [
    body('reportId').isMongoId().withMessage('reportId không hợp lệ'),
    body('status')
        .isIn(['approved', 'rejected'])
        .withMessage('status phải là approved hoặc rejected'),
    body('reviewNote').optional().isString().withMessage('reviewNote phải là chuỗi').trim()
];

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    return next();
}

module.exports = {
    previewAndSubmitRules,
    myReportBodyRules,
    adminListBodyRules,
    reviewRules,
    validate
};
