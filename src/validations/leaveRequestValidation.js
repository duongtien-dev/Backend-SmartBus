const { body } = require('express-validator');

const leaveStatusValues = ['submitted', 'approved', 'rejected'];

const submitLeaveRules = [
    body('startDate').trim().notEmpty().withMessage('startDate là bắt buộc'),
    body('endDate').trim().notEmpty().withMessage('endDate là bắt buộc'),
    body('reason')
        .trim()
        .notEmpty()
        .withMessage('reason là bắt buộc')
        .isLength({ max: 500 })
        .withMessage('reason tối đa 500 ký tự')
];

const myLeaveBodyRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải >= 1'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit phải từ 1 đến 100'),
    body('status')
        .optional()
        .isIn(leaveStatusValues)
        .withMessage('status phải là submitted, approved hoặc rejected')
];

const adminListLeaveRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải >= 1'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit phải từ 1 đến 100'),
    body('status')
        .optional()
        .isIn(leaveStatusValues)
        .withMessage('status phải là submitted, approved hoặc rejected'),
    body('staffId').optional({ values: 'falsy' }).isMongoId().withMessage('staffId không hợp lệ')
];

const adminReviewLeaveRules = [
    body('id').isMongoId().withMessage('ID không hợp lệ'),
    body('status')
        .isIn(['approved', 'rejected'])
        .withMessage('status phải là approved hoặc rejected'),
    body('reviewNote').optional().isString().trim()
];

const idBodyRule = [body('id').isMongoId().withMessage('ID không hợp lệ')];

module.exports = {
    submitLeaveRules,
    myLeaveBodyRules,
    adminListLeaveRules,
    adminReviewLeaveRules,
    idBodyRule
};
