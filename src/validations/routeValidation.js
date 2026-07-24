const { body } = require('express-validator');

const createRouteRules = [
    body('code').trim().notEmpty().withMessage('Mã tuyến không được để trống'),
    body('name').trim().notEmpty().withMessage('Tên tuyến không được để trống'),
    body('description').optional().trim(),
    body('isHot').optional().isBoolean(),
    body('turnOnDay').optional().isInt({ min: 0, max: 7 }),
    body('startName').optional().trim(),
    body('endName').optional().trim(),
    body('stopsCount').optional().isInt({ min: 0 }),
    body('stops').optional().isArray().withMessage('stops phải là mảng'),
    body('stops.*').optional().isMongoId().withMessage('Mỗi phần tử stops phải là ObjectId'),
    body('staffId').optional().isMongoId().withMessage('staffId không hợp lệ'),
];

const updateRouteRules = [
    body('code').optional().trim().notEmpty().withMessage('Mã tuyến không được để trống'),
    body('name').optional().trim().notEmpty().withMessage('Tên tuyến không được để trống'),
    body('description').optional().trim(),
    body('isHot').optional().isBoolean(),
    body('turnOnDay').optional().isInt({ min: 0, max: 7 }),
    body('startName').optional().trim(),
    body('endName').optional().trim(),
    body('stops').optional().isArray().withMessage('stops phải là mảng'),
    body('stops.*').optional().isMongoId().withMessage('Mỗi phần tử stops phải là ObjectId'),
    body('staffId').optional().isMongoId().withMessage('staffId không hợp lệ'),
];

const listRouteRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải là số nguyên dương'),
    body('limit').optional().toInt().isInt({ min: 1, max: 20 }).withMessage('limit từ 1-20'),
    body('search').optional().trim(),
    body('sort').optional().isIn(['newest', 'oldest']).withMessage('sort phải là newest hoặc oldest'),
    body('userId').optional().isMongoId().withMessage('userId không hợp lệ'),
    body('unreviewedOnly').optional().isBoolean().withMessage('unreviewedOnly phải là boolean'),
];

const idBodyRule = [body('id').isMongoId().withMessage('ID không hợp lệ')];

module.exports = {
    createRouteRules,
    updateRouteRules,
    listRouteRules,
    idBodyRule,
};
